import { useState, useEffect } from "react";
import { ScrollView, StatusBar, View, ActivityIndicator } from "react-native";
import { getUserItems } from "../src/graphql/queries";

import { useGraphQLClient } from "../contexts/GraphQLClientContext";

import Item from "../components/Item";
import NewItem from "../components/NewItem";

export default function Home() {
    const client = useGraphQLClient();
    const [loading, setLoading] = useState(true);
    interface Food {
        name: string;
        exp: string;
        hasExp: boolean;
        category: string;
        calories: number;
        quantity: number;
      };
    
    // const [items, setItems] = useState<Food[]>([{name: "text", exp: "test", hasExp: true, category: "test", calories: 100, quantity: 10}]);
    const [items, setItems] = useState<Food[]>([]);
    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // const client = generateClient();
    // Amplify.configure(awsmobile);

    const test = async () => {
        const result = await client.graphql({
            query: getUserItems,
            variables: {
                pk:'UID1',            
            }
        })
        // await new Promise(resolve => setTimeout(resolve, 3000)); // for demo only

        // setItems((result['data']['getUserItems'])
        // .filter((item: object) => item['name'] != null)
        // .map((item: object, i: number) => ({
        //     name: item['name'],
        //     exp: item['exp_date'],
        //     hasExp: item['exp_date'] != 0, category: item['category'],
        //     calories: item['calories'],
        //     quantity: item['quantity'],
        //     handler: () => removeItem(i)}
        //     )));
        console.log(result)
        setLoading(false)
    }

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