import { View, Pressable, Text, StyleSheet, Image } from "react-native";
import { Recipe, ingredient } from "../src/API";
import { useState, useEffect } from "react";

interface Props {
    recipe: Recipe;
}

const RecipeWidget = ({ recipe }: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        // close accordian when new recipes are generated
        setOpen(false);
    }, [recipe])

    return (
        <View style={styles.container}>
            <Pressable style={styles.preview}
                onPress={() => setOpen(!open)}>
                <Image defaultSource={require('../assets/icon.png')} source={{ uri: String(recipe.img) ?? ''}} style={styles.img}/>
                <View style={styles.infoWrapper}>
                    <Text style={styles.title}>{recipe.name}</Text>
                    {(recipe.calories != '' && recipe.calories != '0') && <Text style={styles.info}>Calories: {recipe.calories}</Text>}
                </View>
                
            </Pressable>
            {open && (
                <View style={styles.extend}>
                    <View style={{height: 1, backgroundColor: 'lightgray', marginVertical: 10}}></View>
                    {recipe.ingredients.length !== 0 ? (
                        <View style={styles.content}>
                            <Text style={styles.subTitle}>Ingredients</Text>
                            {recipe.ingredients.map((_ingredient_: ingredient, i) => (
                                <Text key={i}>
                                    {_ingredient_.name && _ingredient_.name.charAt(0).toUpperCase() + _ingredient_.name.slice(1)} {(_ingredient_.amt != null && _ingredient_.amt != '0' && "(" + _ingredient_.amt + ")")} 
                                </Text>
                            ))}
                        </View>
                    ):(
                        <Text>No Ingredients Found</Text>
                    )}
            
                    {recipe.steps.length !== 0? (
                        <View style={styles.content}>
                            <Text style={styles.subTitle}>Directions</Text>
                            {recipe.steps.map((step, i) => (
                                <Text key={i}>
                                    {recipe.steps.length != 1 && ((i + 1).toString() + ". ")}{step}
                                </Text>
                            ))}
                        </View>
                    ):(
                        <Text>No Directions Found</Text>
                    )}

                </View>
            )}
        </View>
    )
}

export default RecipeWidget;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        elevation: 2,
        borderRadius: 8,
        padding: 12,
    },
    preview: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        columnGap: 12,
    },
    search: {
        backgroundColor: 'white',
        padding: 10,
        width: '100%',
        zIndex: 40,
        shadowColor: 'black',
    },
    infoWrapper: {
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    info: {
        color: 'gray',
    },
    title: {
        fontSize: 20,
    },
    subTitle: {
        fontSize: 20,
        color: 'darkturquoise',
    },
    extend:{

    },
    content: {
        marginBottom: 10,
    },
    img:{
        height: 100,
        aspectRatio: 1.5,
        backgroundColor: 'paleturquoise',
        borderRadius: 8,
    }

});