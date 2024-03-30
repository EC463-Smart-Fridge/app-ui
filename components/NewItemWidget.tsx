import { Dispatch, SetStateAction, useState } from 'react'
import { Text, TextInput, View, TouchableHighlight, StyleSheet, Modal, Pressable} from "react-native"
import { Calendar } from 'react-native-calendars'
import { Item } from '../src/API';
import { useGraphQLClient } from '../contexts/GraphQLClientContext';
import AddIcon from '../assets/icons/AddIcon';
import CategoryIcon from '../assets/icons/CategoryIcon';
import CaloriesIcon from '../assets/icons/CaloriesIcon';
import QuantityIcon from '../assets/icons/QuantityIcon';
import ExpirationIcon from '../assets/icons/ExpirationIcon';

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
                <View style={styles.calendarWrapper}>
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
                </View>

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
                        <View style={styles.label}>
                            <ExpirationIcon fill="gray" />
                        </View>
                        <TouchableHighlight onPress={() => setOpen(!open)} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.input} >
                            <Text style={{color: "gray"}}>
                                {date != 0 ? new Date(date * 1000).toLocaleDateString("en-US") : "Add Date"}
                            </Text>
                        </TouchableHighlight>
                    </View>

                    <View style={styles.wrapper}>
                        <View style={styles.label}>
                            <CategoryIcon fill="gray" />    
                        </View>
                        <TextInput
                            placeholder="Add category"
                            value={category}
                            onChangeText={setCategory}
                            inputMode="text"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.label}>
                            Cal
                        </Text>
                        <TextInput
                            placeholder="Calories"
                            value={quantity.toString()}
                            onChangeText={(text) => setQuantity(Number(text))}
                            inputMode="numeric"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.wrapper}>
                        {/* <View style={styles.label}>
                            <QuantityIcon fill="gray" />
                        </View> */}
                        <Text style={styles.label}>
                            Qty
                        </Text>
                        <TextInput
                            placeholder="Quantity"
                            value={calories.toString()}
                            onChangeText={(text) => setCalories(text)}
                            inputMode="numeric"
                            style={styles.input}
                        />
                    </View>
                </View>
                
                <TouchableHighlight 
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
                    activeOpacity={0.6} 
                    underlayColor="#DDDDDD"
                    style={styles.add}
                >
                    <AddIcon />
                    {/* <Text>+</Text> */}
                </TouchableHighlight>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        opacity: 0.9, 
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 8,
        marginVertical: 5,
        marginHorizontal: 10,
        elevation: 2,
    },
    info: {
    },
    name: {
        fontSize: 24,
        // backgroundColor: 'red',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 3,
        // backgroundColor: 'red',
        verticalAlign: 'middle',
        height: 24,
    },
    input: {
        // height: '100%',
        // verticalAlign: 'middle',
        // fontSize: 16,
        // flexGrow: 1,    
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',   
        paddingHorizontal: 8,
        paddingVertical: 2,
        
    },
    label: {
        // paddingRight: 8,
        // verticalAlign: 'middle',
        // fontSize: 16,
        width: 32,
        height: 24,
        borderRadius: 10,
        color: 'gray',
        fontWeight: 'bold',
        textAlign: 'center',
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
    calendarWrapper: {
        marginTop: 200,
        position: 'absolute',
        zIndex: 100,
        top: 0,
        width: '80%',
        alignSelf: 'center',
    },
    calendar: {
        // marginHorizontal: '2.5%',
        // marginTop: 200,
        zIndex: 100,
        borderRadius: 16,
        padding: 16,
    },
    modalBackground: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
    },
});

export default NewItemWidget;