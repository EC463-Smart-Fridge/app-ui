import { Text, View, TouchableHighlight, TextInput, StyleSheet, Modal, Pressable} from "react-native"
import React, { useState } from 'react'; 
import { Item } from '../src/API';
import DeleteIcon from '../assets/icons/DeleteIcon';
import { Calendar } from "react-native-calendars";
import EditIcon from "../assets/icons/EditIcon";
import SaveIcon from "../assets/icons/SaveIcon";
import CancelIcon from "../assets/icons/CancelIcon";
import CategoryIcon from '../assets/icons/CategoryIcon';
import CaloriesIcon from '../assets/icons/CaloriesIcon';
import QuantityIcon from '../assets/icons/QuantityIcon';
import ExpirationIcon from '../assets/icons/ExpirationIcon';

interface Props extends Item {
    deleteHandler: (item:any) => void;
    editHandler: (item:any) => void;
}

const ItemWidget = ({__typename = "Item",name, exp_date, category, calories, quantity, deleteHandler, editHandler}: Props) => {
    const [editMode, setEditMode] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedExpDate, setEditedExpDate] = useState(exp_date ? exp_date : 0);
    const [editedCategory, setEditedCategory] = useState(category ? category : "");
    const [editedQuantity, setEditedQuantity] = useState(quantity ? quantity.toString() : "");
    const [editedCalories, setEditedCalories] = useState(calories ? calories : "");

    const handleCancel = () => {
        setEditMode(false);
        setEditedName(name);
        setEditedQuantity(quantity ? quantity.toString() : "");
        setEditedExpDate(exp_date ?? 0);
    }

    const handleSave = () => {
        // Convert editedExpDate back to timestamp if necessary
        // const date = new Date(editedExpDate.year, editedExpDate.month - 1, editedExpDate.day);
        // const timestamp = date.getTime() / 1000; /
        // const expDateTimestamp = editedExpDate ? new Date(editedExpDate).getTime() / 1000 : null;
        
        editHandler({
            name: editedName,
            quantity: parseInt(editedQuantity, 10),
            // category: editedCategory,
            // calories: editedCalories,
            exp_date: editedExpDate,
        });
        setEditMode(false);
        setEditedName(editedName);
        setEditedQuantity(editedQuantity);
        setEditedExpDate(editedExpDate ? editedExpDate : 0);
    };

    return (<>
            {editMode ? (
                <>
                    <Modal
                        transparent={true}
                        visible={calendarOpen}
                        onRequestClose={() => setCalendarOpen(false)}
                        style={styles.modal}
                    >
                    <View style={styles.calendarWrapper}>
                        <Calendar
                            style={styles.calendar} 
                            // onDayPress={(e) => {setDate(new Date(e.dateString).getTime() / 1000); setOpen(false); }}
                            onDayPress={(day) => {
                                const date = new Date(day.year, day.month - 1, day.day);
                                const timestamp = date.getTime() / 1000; // Convert milliseconds to seconds
                                setEditedExpDate(timestamp);
                                setCalendarOpen(false);
                            }}
                        />
                    </View>

                        <Pressable onPress={() => setCalendarOpen(false)} style={styles.modalBackground}></Pressable>
                    </Modal>
                <View style={{...(styles.container), opacity: 0.9}}>
                    <View style={styles.info}>
                        <TextInput
                            style={styles.name}
                            onChangeText={setEditedName}
                            value={editedName ? (editedName) : ""}
                            inputMode="text"
                        />
                        {/* <View style={styles.wrapper}>
                            <Text>Expires: </Text>
                            <TextInput
                                placeholder="Add Date"
                                onChangeText={setEditedExpDate}
                                value={editedExpDate}
                            />
                        </View> */}
                        <View style={styles.wrapper}>
                            <View style={styles.label}>
                                <ExpirationIcon />
                            </View>
                            <TouchableHighlight onPress={() => setCalendarOpen(!calendarOpen)} activeOpacity={0.6} underlayColor="#DDDDDD">
                                <Text style={styles.input}>
                                    {/* {date != 0 ? new Date(date * 1000).toLocaleDateString("en-US") : "Add Date"} */}
                                    {editedExpDate != 0 ? new Date(editedExpDate * 1000).toLocaleDateString("en-US") : "Add Date"}
                                </Text>
                            </TouchableHighlight>
                        </View>
                        {/* <View style={styles.wrapper}>
                            <Text style={styles.label}>Category: </Text>
                            <TextInput
                                placeholder="Add Category"
                                onChangeText={setEditedCategory}
                                value={editedCategory}
                                inputMode="text"
                                style={styles.input}
                            />
                        </View> */}
                        <View style={styles.wrapper}>
                            <View style={styles.label}>
                                <QuantityIcon />
                            </View>
                            <TextInput
                                placeholder="1"
                                onChangeText={setEditedQuantity}
                                value={editedQuantity}
                                inputMode="numeric"
                                style={styles.input}
                            />
                        </View>
                        {/* <View style={styles.wrapper}>
                            <Text style={styles.label}>Calories: </Text>
                            <TextInput
                                placeholder="0"
                                onChangeText={setEditedCalories}
                                value={editedCalories}
                                inputMode="numeric"
                                style={styles.input}
                            />
                        </View> */}
                    </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableHighlight onPress={handleSave} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.button}>
                            {/* <Text>Save</Text> */}
                            <SaveIcon />
                        </TouchableHighlight>
                        <TouchableHighlight onPress={handleCancel} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.button}>
                            {/* <Text>Cancel</Text> */}
                            <CancelIcon />
                        </TouchableHighlight>
                    </View>
                </View>
                </>
            ) : (
                <View style={styles.container}>
                    <View style={styles.info}>                
                        <Text numberOfLines={1} style={styles.name}>{name}</Text>
                        {exp_date != 0 && exp_date != null && 
                            <View style={styles.wrapper}>
                                <View style={styles.label}>
                                    <ExpirationIcon />
                                </View>
                                <Text>{new Date(exp_date * 1000).toLocaleDateString("en-US")}</Text>
                            </View>
                        }

                        {category != '' && category != null && 
                            <View style={styles.wrapper}>
                                <View style={styles.label}>
                                    <CategoryIcon />
                                </View>
                                <Text>{category}</Text>
                            </View>
                        }

                        {quantity != 0 && quantity != null &&
                            <View style={styles.wrapper}>
                                <View style={styles.label}>
                                    <QuantityIcon />
                                </View>
                                <Text>{quantity}</Text>
                            </View>
                        }

                        {calories != '' && calories != null &&
                            <View style={styles.wrapper}>
                                <View style={styles.label}>
                                    <CaloriesIcon />
                                </View>
                                <Text>{calories}</Text>
                            </View>
                        }
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableHighlight onPress={deleteHandler} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.button}>
                            <DeleteIcon />
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => setEditMode(true)} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.button}>
                            <EditIcon />
                        </TouchableHighlight>
                    </View>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
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
    editInput: {
    },
    name: {
        verticalAlign: 'middle',
        fontSize: 24,
        width: '100%',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 3,
        // backgroundColor: 'red',
        verticalAlign: 'middle',
        height: 24,
    },
    info: {
        // display: 'flex',
        // flexDirection: 'column',
        flexShrink: 1,
        flexGrow: 1,
    },
    input: {
        // height: '100%',
        // verticalAlign: 'middle',
        fontSize: 16,
        // flexGrow: 1,       
    },
    label: {
        width: 24,
        height: 24,
    },
    button: {
        // backgroundColor: 'lightblue',
        borderRadius: 10,
        height: 20,
        padding: 0,
        // backgroundColor: 'red'
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
})

export default ItemWidget;