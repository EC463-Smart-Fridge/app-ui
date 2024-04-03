import { View, Pressable, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useUser } from "../../contexts/GraphQLClientContext";
import { getRecipes } from "../../src/graphql/queries";
import { Redirect, useRouter } from "expo-router";
import { Recipe } from "../../src/API";
import { useState } from "react";
import RecipeWidget from "../../components/RecipeWidget";

export default function Recipes() {
    const {user} = useUser();
    const [search, setSearch] = useState('');
    const router = useRouter();
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
                    <Pressable onPress={() => router.push('/home')} style={({pressed}) => [{backgroundColor: pressed ? 'paleturquoise' : 'white', }, styles.homeButton,]}><Text>Generate from Ingredients</Text></Pressable>
                </View>
            ):(
                <ScrollView style={styles.recipeList}>
                    {user.recipes.map((recipe: Recipe, i: any) => (
                        <View key={i} style={styles.wrapper}>
                            <RecipeWidget recipe={recipe} />
                        </View>
                    ))}
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
        elevation: 2,
    },
    homeButton: {
        padding: 10,
        borderRadius: 10,
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
});