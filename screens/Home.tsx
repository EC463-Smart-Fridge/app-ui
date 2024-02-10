import { useState, useEffect } from "react";
import { ScrollView, StatusBar, View, ActivityIndicator } from "react-native";
import { getUserItems } from "../src/graphql/queries";

import { useGraphQLClient } from "../contexts/GraphQLClientContext";
import { Item } from "../src/API";

import ItemWidget from "../components/ItemWidget";
import NewItemWidget from "../components/NewItemWidget";

export default function Home() {
    const client = useGraphQLClient();
    const [loading, setLoading] = useState(true);
    
    const [items, setItems] = useState<Item[]>([]);
    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));

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
        console.log("testing")
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