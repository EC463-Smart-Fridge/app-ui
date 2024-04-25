import { useState, useEffect } from "react";
import { ScrollView, StatusBar, View, RefreshControl, StyleSheet, Pressable, Text, Alert } from "react-native";
import { getUserItems, getRecipes, getUserRecipes } from "../../src/graphql/queries";
import { removeItem, addItem, editItem } from "../../src/graphql/mutations";
import { router } from "expo-router";

import { DataStore } from '@aws-amplify/datastore';

import { useGraphQLClient, useRefresh, useUser } from "../../contexts/GraphQLClientContext";
import { Item, Recipe, ingredient, storedRecipe } from '../../src/API';

import ItemWidget from "../../components/ItemWidget";
import NewItemWidget from "../../components/NewItemWidget";
import { TextInput } from "react-native";
import { getCurrentUser } from "aws-amplify/auth";
import { Redirect } from "expo-router";
import SaveIcon from "../../assets/icons/SaveIcon";
import SortIcon from "../../assets/icons/SortIcon";
import Spinner from "../../components/Spinner";

interface fridgeItem {
    item: Item,
    checked: boolean
}

enum sort {
    default,
    name,
    exp_date,
    category,
    calories,
    quantity
}

export default function Home() {
    const client = useGraphQLClient();
    const {user, setUser} = useUser();
    const {refresh, setRefresh, expRefresh, setExpRefresh} = useRefresh();

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectState, setSelectState] = useState(false);
    const [sortState, setSortState] = useState(false);
    const [sortType, setSortType] = useState<sort>(sort.default);
    const [ascendingSort, setAscendingSort] = useState(true);

    // const [items, setItems] = useState<fridgeItem[]>([]);
    // let internalItems: fridgeItem[] = [];
    const [internalItems, setInternalItems] = useState<fridgeItem[]>([]);
    const [displayItems, setDisplayItems] = useState<fridgeItem[]>([]);

    // Remove item handler that removes item from both memory and from DynamoDB
    const deleteItemHandler = async (index: number) => {
        setSortState(false);
        const itemToRemove = displayItems[index];
        if (!itemToRemove) return;
        if (!itemToRemove.item.pk || !itemToRemove.item.sk) {
            console.log('Error: No Primary or secondary key');
            return;
        }
        try {
            // Run deleteItem GraphQL mutation
            const deleteResult = await client.graphql({
                query: removeItem,
                variables: {
                    input: {
                        pk: itemToRemove.item.pk,
                        sk: itemToRemove.item.sk,
                    }
                },
            });
    
            console.log('Item deleted successfully', !itemToRemove.item.pk, deleteResult);
            // Remove the item from the interface
            setDisplayItems(displayItems.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error deleting item', error);
        }
    };

    const multiDeleteItemHandler = async () => {
        setLoading(true);
        setSortState(false);
        if (user.isLoggedIn) {
            setLoading(true);
            try {
                // Get list of selected item's prod_name's
                const selected_sk = displayItems.filter(item => item.checked).map(
                    item => item.item.sk
                )

                // <PUT ALERT HERE>: No Items selected
                if (selected_sk === undefined || selected_sk.length == 0) {
                    console.log("No items selected")
                }
                else {

                    await Promise.all(
                        selected_sk.map((_sk_) => {
                            const index = displayItems.findIndex(_iter_ => _iter_.item.sk === _sk_);
                            console.log("deleting", index, _sk_);
                            return deleteItemHandler(index);
                        })
                    )

                    
                }
            } catch (error) {
                console.log('error on fetching recipes', error);
            } finally {
                setLoading(false);
                setRefresh(!refresh);
            }
        }
        else {
            console.log("User not logged in");
        }
    }

    const addItemHandler = async (item: Item) => {
        setSortState(false);

        setInternalItems([{item: item, checked: false}, ...internalItems]);
        if (user.isLoggedIn) {
            try {
                const cur_date = new Date(Date.now() / 1000);
                // Run deleteItem GraphQL mutation
                console.log(item.exp_date)
                const addResult = await client.graphql({
                    query: addItem,
                    variables: {
                        input: {
                            pk: user.userId,
                            name: item.name,
                            exp_date: item.exp_date,
                            category: item.category,
                            calories: item.calories,
                            quantity: item.quantity,
                            added_date: cur_date.getTime()
                        }
                    },
                })
                console.log('Item added successfully', addResult);
            } catch (error) {
                console.error('Error adding item', error);
            }
        }
        else {
            console.log("No user logged in")
        }
    }

    interface EditItemInput {
        pk: string | null | undefined;
        sk: string | null | undefined;
        name?: string;
        category?: string;
        exp_date?: number;
        quantity?: number;
        calories?: string;
    }

    // Edit Item handler that handles modifying an existing item
    const editItemHandler = async (index: number, edits: {name?: string, category?: string, exp_date?: number, quantity?: number, calories?: string}) => {
        setSortState(false);
        const itemToEdit = displayItems[index];
        if (!itemToEdit) return;
        if (!itemToEdit.item.pk || !itemToEdit.item.sk) {
            console.log('Error: No Primary or secondary key');
            return;
        }

        // If none of the values were changed, do nothing
        if (edits == undefined || (edits.name == itemToEdit.item.name && edits.exp_date == itemToEdit.item.exp_date && edits.quantity == itemToEdit.item.quantity)) {
            console.log("No changes found, exiting.");
            return;
        }

        // Start appending to the input values
        var inputValues : EditItemInput = {
            pk: displayItems[Number(index)].item.pk,
            sk: displayItems[Number(index)].item.sk,
            ...edits
        };

        try {
            const editResult = await client.graphql({
                query: editItem,
                variables: {
                    input: inputValues
                },
            });
            // Modify the item on the interface
            console.log('Item edited successfully', editResult);
            setDisplayItems(displayItems.map((item, i) => i == index ? {item: {...item.item, ...edits}, checked: item.checked} : item));
        }
        catch (error) {
            console.error('Error editing item', error);
        }
    };

    // Handler for select 
    const selectItemHandler = async (index: number, check: boolean) => {
        // console.log(items[index].item)
        if (selectState) {
            try {
                let curItems = [...displayItems]
                curItems[index].checked = !check;
                setDisplayItems(curItems);

            } catch (error) {
                console.error('Error selecting item', error);
            }
        }
    }

    // Handler for select all
    const selectAllHandler = async() => {
        if (selectState) {
            try {
                const selectedItems = displayItems.map(item => ({ ...item, checked: !displayItems[0].checked}));
                setDisplayItems(selectedItems);
            }
            catch (error) {
                console.log("Error selecting all items", error);
            }
        }
    }

    // Handler for deselect all
    const deselectAllHandler = async() => {
        try {
            const deselectedItems = displayItems.map(item => ({ ...item, checked: false}));
            setDisplayItems(deselectedItems);
        }
        catch (error) {
            console.log("Error deselecting all items", error);
        }
    }

    // Handler for getting the recipes for the user
    const recipeHandler = async() => {
        setLoading(true);
        setSortState(false);
        if (user.isLoggedIn) {
            try {
                // Get list of selected item's prod_name's
                const selected_ingredients = displayItems.filter(item => item.checked).map(
                    item => item.item.prod_name
                )

                // <PUT ALERT HERE>: No Items selected
                if (selected_ingredients === undefined || selected_ingredients.length == 0) {
                    console.log("No items selected");
                    Alert.alert(  
                        'Alert Title',  
                        'My Alert Msg',  
                        [  
                            {  
                                text: 'OK',  
                                onPress: () => console.log('Cancel Pressed'),  
                                style: 'cancel',  
                            }
                        ],
                        {cancelable: true}
                    );  
                }
                else {

                    // Get saved recipes using GraphQL
                    const result2 = await client.graphql({
                        query: getUserRecipes,
                        variables: {
                            pk: user.userId
                        },
                    })

                    // Map the gathered recipe information to the Recipe datatype
                    if (result2.data && result2.data.getUserRecipes) {
                        const saved_recipes : storedRecipe[] = result2.data.getUserRecipes.filter((recipe: storedRecipe) => recipe.recipe_name !== null)
                        const saved_recipes_parsed : Recipe[] = saved_recipes.map(recipe => ({
                            sk: recipe.sk,
                            recipe_name: recipe.recipe_name,
                            ingredients: recipe.ingredient_amts.map((amt, index) : ingredient => ({
                                amt: amt,
                                name: recipe.ingredient_names[index]
                            })),
                            img: recipe.img,
                            steps: recipe.steps,
                            calories: recipe.calories,
                            saved: true
                        }));
                        // Update current user's recipes
                        user.recipes = saved_recipes_parsed;
                    }
                    else {
                        user.recipes = [];
                    }

                    // Get recipes using Lambda function
                    const result = await client.graphql({
                        query: getRecipes,
                        variables: {
                            input: {
                                ingredients: selected_ingredients
                            }
                        },
                    })
                    const fetched_recipes : Recipe[] = result.data.getRecipes;
                    console.log(fetched_recipes)

                    if (fetched_recipes.length > 0) {
                        // Update current user's recipes
                        user.recipes = user.recipes ? [...fetched_recipes,...user.recipes] : fetched_recipes
                        console.log(user.recipes)
                        router.push('/recipes');
                    }
                    // <PUT ALERT HERE>: No recipes found
                    else {
                        console.log("No Recipes Found")
                        Alert.alert(  
                            'Sorry :(',  
                            'No Recipes Found for Selected Items',  
                            [  
                                {  
                                    text: 'OK',  
                                    onPress: () => console.log('Cancel Pressed'),  
                                    style: 'cancel',  
                                }
                            ],
                            {cancelable: true}
                        );  
                    }
                }
            } catch (error) {
                console.log('error on fetching recipes', error);
            } finally {
                setLoading(false);
                console.log(user.recipes)
            }
        }
        else {
            console.log("User not logged in");
        }
    }

    useEffect(() => {
        console.log('Fetching items');
        const fetchItems = async () => {
            try {
                console.log(user)
                if (user.isLoggedIn) {
                    const result = await client.graphql({
                        query: getUserItems,
                        variables: {
                            pk: user.userId,
                        }
                    })
                    // await new Promise(resolve => setTimeout(resolve, 3000));
                    if (result.data && result.data.getUserItems) {
                        const items: fridgeItem[] = result.data.getUserItems
                            .filter((cur_item: Item) => cur_item.name != null)
                            .map((cur_item: Item, i: number) => ({
                                item: {
                                    pk: cur_item.pk,
                                    sk: cur_item.sk,
                                    name: cur_item.name,
                                    exp_date: cur_item.exp_date,
                                    category: cur_item.category,
                                    calories: cur_item.calories,
                                    quantity: cur_item.quantity,
                                    prod_name: cur_item.prod_name,
                                    added_date: cur_item.added_date
                                },
                                checked: false,
                                handler: () => deleteItemHandler(i)
                            }));
                        // setItems(items);
                        // internalItems = items;
                        setInternalItems(items);
                        // setDisplayItems(items);
                    }
                }
            } catch (error) {
                console.log('error on fetching items', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
        // getCurrUser();
    }, [refresh, user])

    useEffect(() => {
        setExpRefresh(!expRefresh);
        setDisplayItems(internalItems.filter((item, _) => search == '' || item.item.name?.toLowerCase().includes(search.toLowerCase())).sort(sortCriteria));
        console.log('Internal Items:', internalItems)
        console.log('Display Items:', displayItems[1])
        console.log('Refreshing display items')
    }, [internalItems, search, sortType, ascendingSort])
    // }, [ search, sortType, ascendingSort])

    const toggleSelect = () => {
        if (selectState) {
            setSelectState(false);
            deselectAllHandler();
        }
        else {
            setSelectState(true);
        }
    }

    const sortCriteria = (_a_: any, _b_: any) => {
        const sortOrder = ascendingSort ? 1 : -1;
    
        switch (sortType) {
            case sort.name:
                const nameA = _a_.item.name || '';
                const nameB = _b_.item.name || '';
                return nameA === '' ? sortOrder : nameB === '' ? -sortOrder : nameA.localeCompare(nameB) * sortOrder;
    
            case sort.exp_date:
                const expDateA = _a_.item.exp_date || (ascendingSort ? Infinity : -Infinity);
                const expDateB = _b_.item.exp_date || (ascendingSort ? Infinity : -Infinity);
                return expDateA === Infinity ? sortOrder : expDateB === Infinity ? -sortOrder : (expDateA - expDateB) * sortOrder;
    
            case sort.category:
                const categoryA = _a_.item.category || '';
                const categoryB = _b_.item.category || '';
                return categoryA === '' ? sortOrder : categoryB === '' ? -sortOrder : categoryA.localeCompare(categoryB) * sortOrder;
    
            case sort.calories:
                const caloriesA = parseFloat(_a_.item.calories) || (ascendingSort ? Infinity : -Infinity);
                const caloriesB = parseFloat(_b_.item.calories) || (ascendingSort ? Infinity : -Infinity);
                return caloriesA === Infinity ? sortOrder : caloriesB === Infinity ? -sortOrder : (caloriesA - caloriesB) * sortOrder;
    
            case sort.quantity:
                const quantityA = _a_.item.quantity || (ascendingSort ? Infinity : -Infinity);
                const quantityB = _b_.item.quantity || (ascendingSort ? Infinity : -Infinity);
                return quantityA === Infinity ? sortOrder : quantityB === Infinity ? -sortOrder : (quantityA - quantityB) * sortOrder;
    
            default:
                return 0;
        }
    };
    
    
    return (user.isLoggedIn ?
        <>
            {/* Search Bar */}
            <View style={styles.topbar}>
                <TextInput 
                    style={styles.search}
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                />
                <Pressable style={{...styles.topButton, backgroundColor: selectState ? 'darkturquoise' : 'paleturquoise'}} onPress={toggleSelect}>
                    <SaveIcon />
                </Pressable>
                {/* <Pressable style={styles.topButton} onPress={toggleSelect}> */}
                <Pressable style={{...styles.topButton, backgroundColor: sortState ? 'darkturquoise' : 'paleturquoise'}} onPress={() => {setSortState(!sortState)}}>
                    <SortIcon />
                </Pressable>
            </View>
            {selectState && 
                <View style={styles.selectOptionList}>
                    {/* <Pressable style={({pressed}) => [{backgroundColor: pressed ? 'paleturquoise' : 'white', }, styles.selectOption,]} onPress={toggleSelect}>
                        <Text>Cancel</Text>
                    </Pressable> */}

                    <Pressable style={({pressed}) => [{backgroundColor: pressed ? 'paleturquoise' : 'white', }, styles.selectOption,]} onPress={selectAllHandler}>
                        <Text>Select/Deselect All</Text>
                    </Pressable>

                    <Pressable style={({pressed}) => [{backgroundColor: pressed ? 'paleturquoise' : 'white', }, styles.selectOption,]} onPress={recipeHandler}>
                        <Text>Generate Recipes</Text>
                    </Pressable>

                    <Pressable style={({pressed}) => [{backgroundColor: pressed ? 'paleturquoise' : 'white', }, styles.selectOption,]} onPress={multiDeleteItemHandler}>
                        <Text>Delete Selected</Text>
                    </Pressable>
                </View>
            }
            {sortState &&
                <View style={styles.sortOptionList}>
                    <Text style={styles.sortOption}>
                        Sort by:
                    </Text>

                    <View style={{height: 1, backgroundColor: 'gray'}}></View>

                    <Pressable
                        style={{...styles.sortOption, backgroundColor: ascendingSort ? 'paleturquoise' : 'white'}}
                        // onPress={() => {setAscendingSort(true); setRefresh(!refresh)}}
                        onPress={() => setAscendingSort(true)}
                    >
                        <Text>Ascending</Text>
                    </Pressable>
                    <Pressable
                        style={{...styles.sortOption, backgroundColor: !ascendingSort ? 'paleturquoise' : 'white'}}
                        // onPress={() => {setAscendingSort(false); setRefresh(!refresh)}}
                        onPress={() => setAscendingSort(false)}
                    >
                        <Text>Descending</Text>
                    </Pressable>

                    <View style={{height: 1, backgroundColor: 'gray'}}></View>

                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.default ? 'paleturquoise' : 'white'}}
                        // onPress={() => {setSortType(sort.default); setRefresh(!refresh);}}
                        onPress={() => setSortType(sort.default)}
                    >
                        <Text>Default</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.name ? 'paleturquoise' : 'white'}}
                        // onPress={() => {setSortType(sort.name); setRefresh(!refresh);}}
                        onPress={() => setSortType(sort.name)}
                    >
                        <Text>Name</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.exp_date ? 'paleturquoise' : 'white'}}
                        // onPress={() => {setSortType(sort.exp_date); setRefresh(!refresh);}}
                        onPress={() => setSortType(sort.exp_date)}
                    >
                        <Text>Expiration</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.category ? 'paleturquoise' : 'white'}}
                        // onPress={() => {setSortType(sort.category); setRefresh(!refresh);}}
                        onPress={() => setSortType(sort.category)}
                    >
                        <Text>Category</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.calories ? 'paleturquoise' : 'white'}}
                        // onPress={() => {setSortType(sort.calories); setRefresh(!refresh);}}
                        onPress={() => setSortType(sort.calories)}
                    >
                        <Text>Calories</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.quantity ? 'paleturquoise' : 'white'}}
                        // onPress={() => {setSortType(sort.quantity); setRefresh(!refresh);}}
                        onPress={() => setSortType(sort.quantity)}
                    >
                        <Text>Quantity</Text>
                    </Pressable>
                </View>
            }{loading ?
            <Spinner />
            : 
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => {
                        setRefresh(!refresh);
                    }} />
                }
            >
                <View>
                    <>
                        {/* {items.filter((item, i) => search == '' || item.item.name?.toLowerCase().includes(search.toLowerCase())).sort(sortCriteria).map((item, i) => (
                            <View key={i}>
                                <ItemWidget 
                                    __typename="Item"
                                    name={item.item.name} 
                                    exp_date={item.item.exp_date} 
                                    category={item.item.category}
                                    calories={item.item.calories}
                                    quantity={item.item.quantity}
                                    checked={item.checked}
                                    selectMode={selectState}
                                    deleteHandler ={() => {const index = items.findIndex(iter => iter.item.sk === item.item.sk); deleteItemHandler(index)}} 
                                    editHandler = {(edits) => {const index = items.findIndex(iter => iter.item.sk === item.item.sk); editItemHandler(index, edits)}}
                                    selectHandler = {() => {const index = items.findIndex(iter => iter.item.sk === item.item.sk); selectItemHandler(index, item.checked);}}
                                />
                            </View>
                            ))
                        } */}

                        {
                            displayItems.map((item, i) => (
                                <View key={i}>
                                    <ItemWidget 
                                        __typename="Item"
                                        name={item.item.name} 
                                        exp_date={item.item.exp_date} 
                                        category={item.item.category}
                                        calories={item.item.calories}
                                        quantity={item.item.quantity}
                                        checked={item.checked}
                                        selectMode={selectState}
                                        // deleteHandler ={() => {const index = items.findIndex(iter => iter.item.sk === item.item.sk); deleteItemHandler(index)}} 
                                        // editHandler = {(edits) => {const index = items.findIndex(iter => iter.item.sk === item.item.sk); editItemHandler(index, edits)}}
                                        // selectHandler = {() => {const index = items.findIndex(iter => iter.item.sk === item.item.sk); selectItemHandler(index, item.checked);}}
                                        deleteHandler={() => deleteItemHandler(i)}
                                        editHandler={edits => editItemHandler(i, edits)}
                                        selectHandler={() => selectItemHandler(i, item.checked)}
                                    />
                                </View>
                            ))
                        }

                        {
                            search == '' && !selectState && <NewItemWidget handler={addItemHandler}/>
                        }
                    </>
                </View>
                <View style={{height: 10,}}></View>
            </ScrollView>}
        </>
        :
        <Redirect href="/" />
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'paleturquoise', 
        width: '100%', 
    },
    topbar: {
        backgroundColor: 'white',
        padding: 10,
        width: '100%',
        zIndex: 40,
        shadowColor: 'black',
        flexDirection: 'row',
        columnGap: 10,
    },
    search: {
        backgroundColor: 'paleturquoise',
        padding: 10,
        paddingLeft: 20,
        borderRadius: 25,
        flexGrow: 1,
        height: 45,
    },
    topButton: {
        padding: 10,
        borderRadius: 25,
        height: 45,
        aspectRatio: 1,
    },
    selectOptionList: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'whitesmoke',
        // height: 40,
        elevation: 2,
        // padding: 10,
    },
    sortOptionList: {
        width: 128,
        position: 'absolute',
        top: 60,
        right: 10,
        zIndex: 100,
        backgroundColor: 'whitesmoke',
        elevation: 2,
        padding: 4,
        borderRadius: 10,
        rowGap: 4,
    },
    selectOption: {
        paddingVertical: 4,
        // paddingHorizontal: 8,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        flexGrow: 1,
        width: 100,
    },
    sortOption: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        color: 'gray',
    },
});