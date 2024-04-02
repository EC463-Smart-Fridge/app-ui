import { useState, useEffect } from "react";
import { ScrollView, StatusBar, View, ActivityIndicator, RefreshControl, StyleSheet, Pressable, Text } from "react-native";
import { getUserItems, getFridgeUser } from "../../src/graphql/queries";
import { removeItem, addItem, editItem } from "../../src/graphql/mutations";

import { DataStore } from '@aws-amplify/datastore';

import { useGraphQLClient, useUser } from "../../contexts/GraphQLClientContext";
import { Item } from '../../src/API';

import ItemWidget from "../../components/ItemWidget";
import NewItemWidget from "../../components/NewItemWidget";
import { TextInput } from "react-native";
import { getCurrentUser } from "aws-amplify/auth";
import { Redirect } from "expo-router";

interface fridgeItem {
    item: Item,
    checked: boolean
}

export default function Home() {
    const client = useGraphQLClient();
    const {user, setUser} = useUser();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectState, setSelectState] = useState(false);
    // const [editedItems, setEditedItems] = useState({});
    const [refreshes, setRefreshes] = useState(0);

    const [items, setItems] = useState<fridgeItem[]>([]);

    // Remove item handler that removes item from both memory and from DynamoDB
    const deleteItemHandler = async (index: number) => {
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

    const addItemHandler = async (item: Item) => {

        setItems([...items, {item: item, checked: false}]);
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
        name?: string; // Optional
        category?: string; // Optional
        exp_date?: number; // Optional
        quantity?: number; // Optional
        calories?: string; // Optional
    }

    // Edit Item handler that handles modifying an existing item
    const editItemHandler = async (index: number, edits: {name?: string, category?: string, exp_date?: number, quantity?: number, calories?: string}) => {
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
        let input_values : EditItemInput = {
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

            const updatedItems = items.map((item, idx) => {
                if (idx === index) {
                    return { ...item, ...input_values };
                }
                return item;
            });
            setItems(updatedItems);
        }
        catch (error) {
            console.error('Error editing item', error);
        }
    };

    // Handler for select 
    const selectItemHandler = async (index: number, check: boolean) => {
        if (selectState) {
            try {
                let curItems = [...items]
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
        if (selectState) {
            try {
                const deselectedItems = items.map(item => ({ ...item, checked: false}));
                setItems(deselectedItems);
            }
            catch (error) {
                console.log("Error deselecting all items", error);
            }
        }
    }

    useEffect(() => {
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
    }, [refreshes, items.length, user])

    const toggleSelect = () => {
        if (selectState) {
            setSelectState(false);
            deselectAllHandler();
        }
        else {
            setSelectState(true);
        }
    }
    return (user.isLoggedIn ?
        <>
            {/* Search Bar */}
            <View style={styles.search}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                />
                {selectState? (
                    <>
                        <Pressable style={styles.selectBtn} onPress={toggleSelect}>
                            <Text>Cancel</Text>
                        </Pressable>

                        <Pressable style={styles.selectBtn} onPress={selectAllHandler}>
                            <Text>Select All</Text>
                        </Pressable>
                    </>
                ) : (
                    <Pressable style={styles.cancelSelectBtn} onPress={toggleSelect}>
                        <Text>Select</Text>
                    </Pressable>
                )}
                
            </View>
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => {
                        // console.log('Refreshing');
                        setRefreshes(refreshes + 1);
                        console.log({refreshes});
                        // getCurrUser();
                    }} />
                }
            >
                    <View>
                        <>
                        {items.filter((item, i) => search == '' || item.item.name?.toLowerCase().includes(search.toLowerCase())).map((item, i) => (
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
                                    deleteHandler ={() => deleteItemHandler(i)} 
                                    editHandler = {(edits) => editItemHandler(i, edits)}
                                    selectHandler = {() => selectItemHandler(i, item.checked)}
                                />
                            </View>
                            ))}
    
                            {
                                search == '' && !selectState && <NewItemWidget handler={addItemHandler}/>
                            }
                        </>
                    </View>
            </ScrollView>
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
    search: {
        backgroundColor: 'white',
        padding: 10,
        width: '100%',
        zIndex: 40,
        shadowColor: 'black',
    },
    searchInput: {
        backgroundColor: 'paleturquoise',
        padding: 10,
        paddingLeft: 20,
        borderRadius: 25,
    },
    selectBtn: {

    },
    cancelSelectBtn:{},

});