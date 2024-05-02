import { View, Pressable, Text, StyleSheet, Image, TouchableHighlight } from "react-native";
import { Recipe, ingredient } from "../src/API";
import { useState, useEffect } from "react";
import StarIcon from "../assets/icons/StarIcon";
import StarFilledIcon from "../assets/icons/StarFilledIcon";
import { useUser } from "../contexts/UserContext";

interface Props {
    recipe: Recipe;
    recipeButtonHandler: () => void;
}

const RecipeWidget = ({ recipe, recipeButtonHandler}: Props) => {
    const {user, setUser} = useUser();
    const [open, setOpen] = useState<boolean>(false);
    const [favorited, setFavorited] = useState<boolean>(recipe.saved ? true : false);

    useEffect(() => {
        setFavorited(recipe.saved? true: false);
    }, [user.recipes]);

    useEffect(() => {
        console.log("useEffect3")
    }, [recipe, favorited])

    const handleFavorite = async() => {
        recipeButtonHandler();
        setFavorited(recipe.saved? false : true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Pressable style={styles.preview} onPress={() => setOpen(!open)}>
                        {/* <View style={styles.img}> */}
                            <Image defaultSource={require('../assets/icon.png')} source={{ uri: String(recipe.img) ?? ''}} resizeMode="cover" style={styles.img}/>
                        {/* </View> */}
                    <View style={styles.infoWrapper}>
                        <Text style={styles.title}>{recipe.recipe_name}</Text>
                        {(recipe.calories != '' && recipe.calories != '0') && <Text style={styles.info}>Calories: {recipe.calories}</Text>}
                    </View> 
                </Pressable>

                <View style={styles.buttonsContainer}>
                    <TouchableHighlight onPress={handleFavorite} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.button}>
                        {favorited ? <StarFilledIcon/> : <StarIcon/>}
                    </TouchableHighlight>
                </View>
            </View>

            {open && (
            <View style={styles.bottom}>
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
                        <Text numberOfLines={1} style={styles.subTitle}>Directions</Text>
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
        width: '90%',
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
        justifyContent: 'flex-start',
        flexGrow: 1,
        flexShrink: 1,
    },
    info: {
        color: 'gray',
    },
    title: {
        fontSize: 20,
        flexWrap: 'wrap',
    },
    subTitle: {
        fontSize: 20,
        color: 'darkturquoise',
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottom:{

    },
    content: {
        marginBottom: 10,
    },
    img:{
        height: 128,
        aspectRatio: 1,
        backgroundColor: 'paleturquoise',
        borderRadius: 10,
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 20,
        marginLeft: 10,
    },
    button: {
        borderRadius: 10,
        height: 20,
        padding: 0,
    },

});