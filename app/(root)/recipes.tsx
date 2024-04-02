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
    const [readRecipe, setRead] = useState(0);

    const func = () => {
        console.log(user);
    }
    const selectRecipe = (i: number) => {
        setRead(i + 1);
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
                            <View key={i} >
                                <Pressable style={styles.recipe_container}
                                    onPress={() => selectRecipe(i)}>
                                    <Text>{recipe.name}</Text>
                                    <Text>{recipe.img}</Text>
                                    <Text>{recipe.calories}</Text>
                                    {/* THINGS TO ADD:
                                        Styling
                                        Pressable => Only shows recipe name / img / Calorie count at first, Press = displays steps and ingredients
                                        Can't display ingredients atm, they are stored as array of {ingredient: string, amt: string} 
                                    */}
                                    
                                </Pressable>
                                {readRecipe === (i + 1)? (
                                    <>
                                        {recipe.ingredients.length !== 0? (
                                            <>
                                                <Text>Recipe Ingredients</Text>
                                                {recipe.ingredients.map((ingredient, id1) => (
                                                    <Text key={id1}>
                                                        {ingredient.name}: {ingredient.amt}
                                                    </Text>
                                                ))}
                                            </>
                                        ):(
                                            <Text>No Ingredients Found</Text>
                                        )}
                                
                                        {recipe.steps.length !== 0? (
                                            <>
                                                <Text>Recipe Steps</Text>
                                                {recipe.steps.map((step, id2) => (
                                                    <Text key={id2}>
                                                        {id2 + 1}: {step}
                                                    </Text>
                                                ))}
                                            </>
                                        ):(
                                            <Text>No Recipe Steps Found</Text>
                                        )}

                                    </>
                                ):(
                                    <></>
                                )}
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
    recipeBtn:{},
    recipe_container: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        marginTop: 5,
        marginHorizontal: 10,
        elevation: 2,
    },

});