import { useState, useEffect } from "react";
import { ScrollView, StatusBar, View, ActivityIndicator } from "react-native";
import { getUserItems } from "../src/graphql/queries";
import { deleteItem } from "../src/graphql/mutations";

import { useGraphQLClient } from "../contexts/GraphQLClientContext";
import { Item } from '../src/API';

import ItemWidget from "../components/ItemWidget";
import NewItemWidget from "../components/NewItemWidget";

export default function Home() {
    const client = useGraphQLClient();
    const [loading, setLoading] = useState(true);

    const [items, setItems] = useState<Item[]>([]);

    // Remove item handler that removes item from both memory and from DynamoDB
    const removeItem = async (index: number) => {
        const itemToRemove = items[index];
        if (!itemToRemove) return;
        if (!itemToRemove.pk || !itemToRemove.sk) {
            console.log('Error: No Primary or secondary key');
            return;
        }
        try {
            // Run deleteItem GraphQL mutation
            const deleteResult = await client.graphql({
                query: deleteItem,
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
                        handler: () => removeItem(i)
                    }));
                setItems(items);
            }
        } catch (error) {
            console.log('error on fetching items', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        test();
    }, [])

    return (
    <ScrollView
        style={{
        padding: 10,
        backgroundColor: 'whitesmoke'
        }}
    >
        <StatusBar/>
        {loading ?
            <ActivityIndicator size="large" color="#0000ff" animating={loading} />
            :
             <>
                {items.map((item, i) => (
                <View key={i}>
                    <ItemWidget 
                        name={item.name} 
                        exp_date={item.exp_date} 
                        category={item.category}
                        calories={item.calories}
                        quantity={item.quantity}
                        handler={() => removeItem(i)} 
                    />
                </View>
                ))}

                <NewItemWidget items={items} setItems={setItems}/>
             </>
        }
    </ScrollView>
    )
}