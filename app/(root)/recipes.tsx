import { View, Pressable, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useGraphQLClient, useUser } from "../../contexts/GraphQLClientContext";
import { getRecipes } from "../../src/graphql/queries";
import { Redirect } from "expo-router";
import { Recipe } from "../../src/API";
import { useState, useEffect } from "react";

export default function Recipes() {
    const client = useGraphQLClient();
    const {user, setUser} = useUser();
    const [search, setSearch] = useState('');

    const func = () => {
        console.log(user);
    }

    return (user.isLoggedIn ?
        <>
            <View style={styles.search}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                /> 
            </View>
            <Pressable onPress={func}>
                <Text>Test</Text>
            </Pressable>

            {(user.recipes === undefined || user.recipes.length == 0)? (
                <Text>No Recipes</Text>
            ):(
                <ScrollView 
                    style={styles.container}>
                    <View>
                        <>
                        {user.recipes.map((recipe, i) => (
                            <View key={i}>
                                <Text>{recipe.name}</Text>
                                <Text>{recipe.img}</Text>
                                <Text>{recipe.calories}</Text>
                                {/* THINGS TO ADD:
                                    Styling
                                    Pressable => Only shows recipe name / img / Calorie count at first, Press = displays steps and ingredients
                                    Can't display ingredients atm, they are stored as array of {ingredient: string, amt: string} 
                                */}
                                {/* {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                                    <Text key={index}>{ingredient}</Text>
                                ))} */}
                                <Text>{recipe.steps}</Text>
                            </View>
                            ))}

                        </>
                    </View>
                </ScrollView>
            )}
            
        </>
        :
        <Redirect href="/" />
    )


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
            <Redirect href="/" />
        )
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
    recipeBtn:{}

});