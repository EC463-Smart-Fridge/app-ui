import React, { Fragment } from 'react'
import {Dispatch, SetStateAction, useState} from 'react'
import { Text, TextInput, View, Pressable, StyleSheet} from "react-native"
import { Calendar } from 'react-native-calendars'
import PlusIcon from '../assets/icons/PlusIcon';

interface Food {
    name: string;
    exp: string;
    hasExp: boolean;
    category: string;
    calories: number;
    quantity: number;
};

interface Props {
    items: Food[];
    setItems: Dispatch<SetStateAction<Food[]>>;

}

const NewItem = ({items, setItems}: Props) => {
    const [input, setInput] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [hasDate, setHasDate] = useState<boolean>(false)
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState("")
    const [calories, setCalories] = useState(0)
    const [quantity, setQuantity] = useState(1)

    const inputHandler = () => {
        if (input.trim() != "") {
            setItems([...items, ({
                name: input, 
                exp: date, 
                hasExp: hasDate, 
                category: category, 
                calories: calories, 
                quantity: quantity,})]);
            setHasDate(false)
        } 
        setInput("")
    }
    return (
        <Fragment>
            <View  
                style={styles.container}
            >
                <View style={styles.info}>                
                    <TextInput
                        placeholder="Add item"
                        value={input}
                        onChangeText={setInput}
                        style={styles.input}
                    />

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>
                            Expiration Date: 
                        </Text>
                        <Pressable onPress={() => setOpen(!open)} style={styles.date}>
                            <Text style={styles.date}>
                                {hasDate ? date : "Add Date"}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>
                            Category:
                        </Text>
                        <TextInput
                            placeholder="Add category"
                            value={category}
                            onChangeText={setCategory}
                            style={styles.category}
                        />
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>
                            Quantity:
                        </Text>
                        <TextInput
                            placeholder="1"
                            value={quantity.toString()}
                            onChangeText={(text) => setQuantity(Number(text))}
                            keyboardType="numeric"
                            style={styles.quantity}
                        />
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>
                            Calories:
                        </Text>
                        <TextInput
                            placeholder="0"
                            value={calories.toString()}
                            onChangeText={(text) => setCalories(Number(text))}
                            keyboardType="numeric"
                            style={styles.quantity}
                        />
                    </View>
                </View>
                
                <Pressable
                    onPress={inputHandler}
                    style={styles.add}
                >
                    <PlusIcon />
                </Pressable>
            </View>
            {open ? 
                <Calendar
                    onDayPress={(e) => {setDate(e.dateString); setOpen(false); setHasDate(true)}}
                />
                :
                <></>}
        </Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'lightgray',
        opacity: 0.5, 
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },
    input: {
        height: '100%',
        textAlignVertical: 'center',
        fontSize: 20,
        flexGrow: 1,       
    },
    quantity: {
    },
    date: {
    },
    category: {
   
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: 18,
        marginVertical: 3,
    },
    label: {
        paddingRight: 8,
    },
    add: {
        width: 24,
        height: '100%',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'flex-start',
    }   
})

export default NewItem;