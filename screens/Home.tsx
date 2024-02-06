import { useState, useEffect } from "react";
import { ScrollView, StatusBar, View, ActivityIndicator } from "react-native";
import { getUserItems } from "../src/graphql/queries";

import { useGraphQLClient } from "../contexts/GraphQLClientContext";

import Item from "../components/Item";
import NewItem from "../components/NewItem";

interface Food {
    name: string;
    exp: string;
    hasExp: boolean;
    category: string;
    calories: number;
    quantity: number;
};

export default function Home() {
    const client = useGraphQLClient();
    const [loading, setLoading] = useState(true);
    
    const [items, setItems] = useState<Food[]>([]);
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
                const items: Food[] = result.data.getUserItems
                    .filter((item: Food) => item.name != null)
                    .map((item: Food, i: number) => ({
                        name: item.name,
                        exp: item.exp,
                        hasExp: Number(item.exp) != 0, 
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
                    <Item 
                        name={item.name} 
                        exp={item.exp} 
                        hasExp={item.hasExp} 
                        category={item.category}
                        calories={item.calories}
                        quantity={item.quantity}
                        handler={() => removeItem(i)} 
                    />
                </View>
                ))}

                <NewItem items={items} setItems={setItems}/>
             </>
        }
    </ScrollView>
    )
}