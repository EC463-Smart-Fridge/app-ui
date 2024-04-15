import { View, Pressable, Text, TextInput, StyleSheet, ScrollView, TouchableHighlight } from "react-native";
import { useUser, useGraphQLClient } from "../../contexts/GraphQLClientContext";
import { getRecipes } from "../../src/graphql/queries";
import { Redirect, useRouter } from "expo-router";
import { Recipe } from '../../src/models';
import { useState } from "react";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";
import RecipeWidget from "../../components/RecipeWidget";
import { addUserRecipe, removeRecipe } from "../../src/graphql/mutations";

export default function Recipes() {
    const client = useGraphQLClient();
    const {user, setUser} = useUser();
    const [search, setSearch] = useState('');
    const router = useRouter();

    // Handler for saving a recipe to the user's DynamoDB information
    const saveRecipeHandler = async (recipe: Recipe) => {
        if (user.isLoggedIn) {
            try {
                const addResult = await client.graphql({
                    query: addUserRecipe,
                    variables: {
                        input: {
                            pk: user.userId,
                            sk: recipe.sk,
                            recip_name: recipe.name,
                            img: recipe.img,
                            steps: recipe.steps,
                            ingredient_names: recipe.ingredients,
                            ingredient_amts: recipe.ingredients,
                            calories: recipe.calories
                        }
                    },
                })
                console.log('Recipe saved successfully', addResult);
            } catch (error) {
                console.error('Error saving recipe', error);
            }
        }
        else {
            console.log("No user logged in")
        }
    }

    // Remove recipe handler that unsaves the recipe from the user's account
    const deleteRecipeHandler = async (index: number) => {
        const recipeToRemove = user.recipes[index];
        if (!recipeToRemove) return;
        if (!recipeToRemove.pk || !recipeToRemove.sk) {
            console.log('Error: No Primary or secondary key');
            return;
        }
        try {
            // Run deleteItem GraphQL mutation
            const deleteResult = await client.graphql({
                query: removeRecipe,
                variables: {
                    input: {
                        pk: recipeToRemove.pk,
                        sk: recipeToRemove.sk,
                    }
                },
            });
    
            console.log('Recipe deleted successfully', deleteResult);
            // Remove the item from the interface
            setItems(items.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error deleting recipe', error);
        }
    };

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

            {(user.recipes === undefined || user.recipes.length == 0)? (
                <View style={styles.container}>
                    <Pressable onPress={() => router.push('/home')} style={({pressed}) => [{backgroundColor: pressed ? 'lightgray' : 'white', }, styles.homeButton,]}><Text>Generate from Ingredients</Text></Pressable>
                </View>
            ):(
                <ScrollView style={styles.recipeList}>
                    {user.recipes.map((recipe: Recipe, i: any) => (
                        <View key={i} style={styles.wrapper}>
                            
                            <View style={styles.buttonsContainer}>
                                <TouchableHighlight onPress={deleteHandler} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.button}>
                                    <DeleteIcon />
                                </TouchableHighlight>
                            </View>
                            <RecipeWidget recipe={recipe} />
                        </View>
                    ))}
                    <View style={{height: 10,}}></View>
                </ScrollView>
            )}
            
        </>
        :
        <Redirect href="/" />
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        height: '100%',
        paddingBottom: 128,
    },
    homeButton: {
        padding: 10,
        borderRadius: 10,
        elevation: 2,
    },
    recipeList: {
        backgroundColor: 'paleturquoise', 
        width: '100%', 
        flexGrow: 1,
        padding: 10,
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
        color: 'gray',
    },
    wrapper: {
        marginBottom: 10,
    },
    recipeContiner: {
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
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 20,
        marginLeft: 10,
        // height: '100%',
        // backgroundColor: 'red',
    },
});