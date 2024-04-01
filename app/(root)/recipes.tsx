import { View, Pressable, Text } from "react-native";
import { useGraphQLClient, useUser } from "../../contexts/GraphQLClientContext";
import { getRecipes } from "../../src/graphql/queries";

export default function Recipes() {
    const client = useGraphQLClient();
    const {user, setUser} = useUser();

    const getUserRecipes = async() => {
        try {
            const result = await client.graphql({
                query: getRecipes,
                variables: {
                    input: {
                        ingredients: ["eggs", "FAIRLIFE milk" , "sargento string cheese"]
                    }
                },
            })
            console.log(result)
        } catch (error) {
            console.log('error on fetching recipes', error);
        } 
    }
    
    return (
        user.isLoggedIn ? (
            <View>
                <Text>Recipes</Text>
            </View>
        ) : (
            <View>
                <Text>You are not logged in</Text>
            </View>
        )
    )
}