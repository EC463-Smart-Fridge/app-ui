import { useState, useEffect } from "react";
import { ScrollView, StatusBar, View, ActivityIndicator, RefreshControl, StyleSheet } from "react-native";
import { getUserItems } from "../src/graphql/queries";
import { removeItem, addItem, editItem } from "../src/graphql/mutations";

import { DataStore } from '@aws-amplify/datastore';

import { useGraphQLClient } from "../contexts/GraphQLClientContext";
import { Item } from '../src/API';

import ItemWidget from "../components/ItemWidget";
import NewItemWidget from "../components/NewItemWidget";
import { TextInput } from "react-native";


export default function Home() {
    const client = useGraphQLClient();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    // const [editedItems, setEditedItems] = useState({});
    const [refreshes, setRefreshes] = useState(0);

    const [items, setItems] = useState<Item[]>([]);

    // Remove item handler that removes item from both memory and from DynamoDB
    const deleteItemHandler = async (index: number) => {
        const itemToRemove = items[index];
        if (!itemToRemove) return;
        if (!itemToRemove.pk || !itemToRemove.sk) {
            console.log('Error: No Primary or secondary key');
            return;
        }
        try {
            // Run deleteItem GraphQL mutation
            const deleteResult = await client.graphql({
                query: removeItem,
                variables: {
                    input: {
                        pk: itemToRemove.pk,
                        sk: itemToRemove.sk,
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
        setItems([...items, item]);
        try {
            // Run deleteItem GraphQL mutation
            console.log(item.exp_date)
            const addResult = await client.graphql({
                query: addItem,
                variables: {
                    input: {
                        pk: 'UID1',
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


    // const addItemHandler = async (item: Item) => {
    //     try {
    //         // Run deleteItem GraphQL mutation

    //         const addResult = await DataStore.save(
    //             new Item({
    //                 pk: 'UID1',
    //                 name: item.name,
    //                 exp_date: item.exp_date,
    //                 category: item.category,
    //                 calories: item.calories,
    //                 quantity: item.quantity,
    //             })
    //           );
    //           setItems([...items, item]);
    //         console.log('Item added successfully', addResult);
    //     } catch (error) {
    //         console.error('Error adding item', error);
    //     }
    // }

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
        if (!itemToEdit.pk || !itemToEdit.sk) {
            console.log('Error: No Primary or secondary key');
            return;
        }

        // If none of the values were changed, do nothing
        if (edits == undefined || (edits.name == itemToEdit.name && edits.exp_date == itemToEdit.exp_date && edits.quantity == itemToEdit.quantity)) {
            console.log("No changes found, exiting.");
            return;
        }

        // Start appending to the input values
        let input_values : EditItemInput = {
            pk: items[Number(index)].pk,
            sk: items[Number(index)].sk,
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

    useEffect(() => {
        const test = async () => {
            try {
                const result = await client.graphql({
                    query: getUserItems,
                    variables: {
                        pk:'UID1',            
                    }
                })
                // await new Promise(resolve => setTimeout(resolve, 3000));
                if (result.data && result.data.getUserItems) {
                    const items: Item[] = result.data.getUserItems
                        .filter((item: Item) => item.name != null)
                        .map((item: Item, i: number) => ({
                            pk: item.pk,
                            sk: item.sk,
                            name: item.name,
                            exp_date: item.exp_date,
                            category: item.category,
                            calories: item.calories,
                            quantity: item.quantity,
                            handler: () => deleteItemHandler(i)
                        }));
                    setItems(items);
                }
            } catch (error) {
                console.log('error on fetching items', error);
            } finally {
                setLoading(false);
            }
        };
        test();
    }, [refreshes, items.length])

    return (
        <>
            {/* Search Bar */}
            <View style={styles.search}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => {
                        // console.log('Refreshing');
                        setRefreshes(refreshes + 1);
                        console.log({refreshes});
                    }} />
                }
            >
                {loading ?
                    <ActivityIndicator size="large" color="#0000ff" animating={loading} />
                    :
                    <>
                        {/* {items.map((item, i) => ( */}
                        
                        {items.filter((item, i) => search == '' || item.name?.toLowerCase().includes(search.toLowerCase())).map((item, i) => (
                        <View key={i}>
                            <ItemWidget 
                                __typename="Item"
                                name={item.name} 
                                exp_date={item.exp_date} 
                                category={item.category}
                                calories={item.calories}
                                quantity={item.quantity}
                                deleteHandler ={() => deleteItemHandler(i)} 
                                editHandler = {(edits) => editItemHandler(i, edits)}
                            />
                        </View>
                        ))}

                        {
                            search == '' && <NewItemWidget handler={addItemHandler}/>
                        }
                    </>
                }
            </ScrollView>
        </>
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
    }
});