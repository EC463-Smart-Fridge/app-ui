import { Dispatch, SetStateAction, useState } from 'react'
import { Text, TextInput, View, Pressable, StyleSheet, Modal} from "react-native"
import { Calendar } from 'react-native-calendars'
import AddIcon from '../assets/icons/AddIcon';
import { Item } from '../src/API';
import { useGraphQLClient } from '../contexts/GraphQLClientContext';

interface Props {
    handler: (item: Item) => void;
}

const NewItemWidget = ({handler}: Props) => {
    const [input, setInput] = useState<string>("");
    const [date, setDate] = useState(0);
    const [category, setCategory] = useState<string>("")
    const [calories, setCalories] = useState<string>("")
    const [quantity, setQuantity] = useState<number>(1)
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Modal
                transparent={true}
                visible={open}
                onRequestClose={() => setOpen(false)}
                style={styles.modal}
            >
                <Calendar
                    style={styles.calendar} 
                    // onDayPress={(e) => {setDate(new Date(e.dateString).getTime() / 1000); setOpen(false); }}
                    onDayPress={(day) => {
                        const date = new Date(day.year, day.month - 1, day.day);
                        const timestamp = date.getTime() / 1000; // Convert milliseconds to seconds
                        setDate(timestamp);
                        setOpen(false);
                      }}
                />

                <Pressable onPress={() => setOpen(false)} style={styles.modalBackground}></Pressable>
            </Modal>
        
            <View style={styles.container}>
                <View style={styles.info}>                
                    <TextInput
                        placeholder="Add item"
                        value={input}
                        onChangeText={setInput}
                        style={styles.name}
                    />

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>Expiration Date:</Text>
                        <Pressable onPress={() => setOpen(!open)} >
                            <Text style={styles.input}>
                                {date != 0 ? new Date(date * 1000).toLocaleDateString("en-US") : "Add Date"}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>Category:</Text>
                        <TextInput
                            placeholder="Add category"
                            value={category}
                            onChangeText={setCategory}
                            inputMode="text"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>Quantity:</Text>
                        <TextInput
                            placeholder="1"
                            value={quantity.toString()}
                            onChangeText={(text) => setQuantity(Number(text))}
                            inputMode="numeric"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>Calories:</Text>
                        <TextInput
                            placeholder="0"
                            value={calories.toString()}
                            onChangeText={(text) => setCalories(text)}
                            inputMode="numeric"
                            style={styles.input}
                        />
                    </View>
                </View>
                
                <Pressable 
                    onPress={() => {
                        if (input === "") return;
                        handler({__typename: "Item", name: input, exp_date: date, category: category, calories: calories, quantity: quantity});
                        // handler(new Item({
                        //     name: input, 
                        //     exp_date: date, 
                        //     category: category, 
                        //     calories: calories, 
                        //     quantity: quantity
                        // }));
                        setInput("");
                        setDate(0);
                        setCategory("");
                        setCalories("");
                        setQuantity(1);
                    }} 
                    
                    style={styles.add}
                >
                    <AddIcon />
                    {/* <Text>+</Text> */}
                </Pressable>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'lightgray',
        opacity: 0.5, 
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 8,
    },
    info: {
    },
    name: {
        fontSize: 24,
        // backgroundColor: 'red',
    },
    input: {
        // height: '100%',
        // verticalAlign: 'middle',
        fontSize: 16,
        // flexGrow: 1,       
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 3,
        // backgroundColor: 'red',
        verticalAlign: 'middle',
        height: 24,
    },
    label: {
        paddingRight: 8,
        verticalAlign: 'middle',
        // backgroundColor: 'green',
        fontSize: 16,
    },
    add: {
        width: 24,
        height: 24,
        borderRadius: 10,
        // height: '100%',
        // display: 'flex',
        // justifyContent: 'flex-start',
    },
    modal: {
        margin: 10,
    },
    modalBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendar: {
        // height: 500,
        // backgroundColor: 'red',
        // width: '95%',
        marginHorizontal: '2.5%',
        marginTop: '40%',
        zIndex: 100,
        borderRadius: 16,
        padding: 16,
    }
});

export default NewItemWidget;