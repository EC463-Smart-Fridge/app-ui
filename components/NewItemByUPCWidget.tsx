import { Fragment } from 'react'
import { Dispatch, SetStateAction, useState } from 'react'
import { Text, TextInput, View, Pressable, StyleSheet} from "react-native"
import { Calendar } from 'react-native-calendars'
import PlusIcon from '../assets/icons/PlusIcon';
import { Item } from '../src/models';

interface Props {
    items: Item[];
    setItems: Dispatch<SetStateAction<Item[]>>;
}

const NewItemWidget = ({items, setItems}: Props) => {
    const [input, setInput] = useState<string>("");
    const [upc, setCategory] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)

    const inputHandler = () => {
        if (input.trim() != "") {
            setItems([...items, ({
                __typename: "Item",
                name: input, 
                exp_date: date,
                category: category, 
                calories: calories, 
                quantity: quantity,})]);
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
                        <Text style={styles.label}>Expiration Date:</Text>
                        <Pressable onPress={() => setOpen(!open)} style={styles.date}>
                            <Text style={styles.date}>
                                {date != 0 ? new Date(date).toLocaleDateString("en-US") : "Add Date"}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>Category:</Text>
                        <TextInput
                            placeholder="Add category"
                            value={category}
                            onChangeText={setCategory}
                            style={styles.category}
                        />
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>Quantity:</Text>
                        <TextInput
                            placeholder="1"
                            value={quantity.toString()}
                            onChangeText={(text) => setQuantity(Number(text))}
                            inputMode="numeric"
                            style={styles.quantity}
                        />
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>Calories:</Text>
                        <TextInput
                            placeholder="0"
                            value={calories.toString()}
                            onChangeText={(text) => setCalories(text)}
                            inputMode="numeric"
                            style={styles.quantity}
                        />
                    </View>
                </View>
                
                <Pressable onPress={inputHandler} style={styles.add}>
                    <PlusIcon />
                </Pressable>
            </View>
            {open && <Calendar onDayPress={(e) => {setDate(new Date(e.dateString).getTime()); setOpen(false);}}/>}
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
        verticalAlign: 'middle',
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

export default NewItemWidget;