import { useState, useEffect } from "react";
import { ScrollView, StatusBar, View, RefreshControl, StyleSheet, Pressable, Text, Alert } from "react-native";
import { getUserItems, getRecipes } from "../../src/graphql/queries";
import { removeItem, addItem, editItem } from "../../src/graphql/mutations";
import { router } from "expo-router";

import { DataStore } from '@aws-amplify/datastore';

import { useGraphQLClient, useRefresh, useUser } from "../../contexts/GraphQLClientContext";
import { Item, Recipe, ingredient } from '../../src/API';

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
    const {refresh, setRefresh} = useRefresh();

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectState, setSelectState] = useState(false);
    const [sortState, setSortState] = useState(false);
    const [sortType, setSortType] = useState<sort>(sort.default);
    const [ascendingSort, setAscendingSort] = useState(true);

    const [items, setItems] = useState<fridgeItem[]>([]);

    // Remove item handler that removes item from both memory and from DynamoDB
    const deleteItemHandler = async (index: number) => {
        setSortState(false);
        const itemToRemove = items[index];
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
    
            console.log('Item deleted successfully', deleteResult);
            // Remove the item from the interface
            setItems(items.filter((_, i) => i !== index));
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
                const selected_sk = items.filter(item => item.checked).map(
                    item => item.item.sk
                )

                // <PUT ALERT HERE>: No Items selected
                if (selected_sk === undefined || selected_sk.length == 0) {
                    console.log("No items selected")
                }
                else {

                    await Promise.all(
                        selected_sk.map((_sk_) => {
                            const index = items.findIndex(_iter_ => _iter_.item.sk === _sk_);
                            console.log("deleting", index, _sk_);
                            return deleteItemHandler(index);
                        })
                    )

                    
                }
            } catch (error) {
                console.log('error on fetching recipes', error);
            } finally {
                setLoading(false);
            }
        }
        else {
            console.log("User not logged in");
        }
    }

    const addItemHandler = async (item: Item) => {
        setSortState(false);

        setItems([{item: item, checked: false}, ...items]);
        if (user.isLoggedIn) {
            try {
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
        const itemToEdit = items[index];
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
        var input_values : EditItemInput = {
            pk: items[Number(index)].item.pk,
            sk: items[Number(index)].item.sk,
            ...edits
        };

        try {
            const editResult = await client.graphql({
                query: editItem,
                variables: {
                    input: input_values
                },
            });
            // Modify the item on the interface
            console.log('Item edited successfully', editResult);
            setItems(items.map((item, i) => i == index ? {item: {...item.item, ...edits}, checked: item.checked} : item));
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
                var curItems = [...items]
                curItems[index].checked = !check;
                setItems(curItems);
            } catch (error) {
                console.error('Error selecting item', error);
            }
        }
    }

    // Handler for select all
    const selectAllHandler = async() => {
        if (selectState) {
            try {
                if (!items[0].checked) {
                    const selectedItems = items.map(item => ({ ...item, checked: true}));
                    setItems(selectedItems);
                }
                else {
                    const selectedItems = items.map(item => ({ ...item, checked: false}));
                    setItems(selectedItems);
                }
            }
            catch (error) {
                console.log("Error selecting all items", error);
            }
        }
    }

    // Handler for deselect all
    const deselectAllHandler = async() => {
        try {
            const deselectedItems = items.map(item => ({ ...item, checked: false}));
            setItems(deselectedItems);
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
                const selected_ingredients = items.filter(item => item.checked).map(
                    item=> item.item.prod_name
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

                    // Get recipes using Lambda function
                    const result = await client.graphql({
                        query: getRecipes,
                        variables: {
                            input: {
                                ingredients: selected_ingredients
                            }
                        },
                    })
                    const fetched_recipes : [Recipe] = result.data.getRecipes;
                    console.log(fetched_recipes)

                    if (result) {
                        // Update current user's recipes
                        setUser({
                            isLoggedIn: user.isLoggedIn,
                            userId: user.userId,
                            username: user.username,
                            email: user.email,
                            name: user.name,
                            recipes: fetched_recipes
                        });
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
            }
        }
        else {
            console.log("User not logged in");
        }
    }

    useEffect(() => {
        console.log('Fetching items');
        const test = async () => {
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
                                    prod_name: cur_item.prod_name
                                },
                                checked: false,
                                handler: () => deleteItemHandler(i)
                            }));
                        setItems(items);
                    }
                }
            } catch (error) {
                console.log('error on fetching items', error);
            } finally {
                setLoading(false);
            }
        };
        test();
        // getCurrUser();
    }, [refresh, user, items.length])

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
                        onPress={() => {setAscendingSort(true); setRefresh(!refresh)}}
                    >
                        <Text>Ascending</Text>
                    </Pressable>
                    <Pressable
                        style={{...styles.sortOption, backgroundColor: !ascendingSort ? 'paleturquoise' : 'white'}}
                        onPress={() => {setAscendingSort(false); setRefresh(!refresh)}}
                    >
                        <Text>Descending</Text>
                    </Pressable>

                    <View style={{height: 1, backgroundColor: 'gray'}}></View>

                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.default ? 'paleturquoise' : 'white'}}
                        onPress={() => {setSortType(sort.default); setRefresh(!refresh);}}
                    >
                        <Text>Default</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.name ? 'paleturquoise' : 'white'}}
                        onPress={() => {setSortType(sort.name); setRefresh(!refresh);}}
                    >
                        <Text>Name</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.exp_date ? 'paleturquoise' : 'white'}}
                        onPress={() => {setSortType(sort.exp_date); setRefresh(!refresh);}}
                    >
                        <Text>Expiration</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.category ? 'paleturquoise' : 'white'}}
                        onPress={() => {setSortType(sort.category); setRefresh(!refresh);}}
                    >
                        <Text>Category</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.calories ? 'paleturquoise' : 'white'}}
                        onPress={() => {setSortType(sort.calories); setRefresh(!refresh);}}
                    >
                        <Text>Calories</Text>
                    </Pressable>
                    <Pressable 
                        style={{...styles.sortOption, backgroundColor: sortType == sort.quantity ? 'paleturquoise' : 'white'}}
                        onPress={() => {setSortType(sort.quantity); setRefresh(!refresh);}}
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
                    {items.filter((item, i) => search == '' || item.item.name?.toLowerCase().includes(search.toLowerCase())).sort(sortCriteria).map((item, i) => (
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
                        ))}

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