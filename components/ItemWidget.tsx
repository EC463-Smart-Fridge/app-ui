import { Text, View, TouchableHighlight, TextInput, StyleSheet, Modal, Pressable} from "react-native"
import React, { useState, useEffect } from 'react'; 
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
import { useRefresh } from "../contexts/GraphQLClientContext";

interface Props extends Item {
    checked: boolean;
    selectMode: boolean;
    deleteHandler: (item:any) => void;
    editHandler: (item:any) => void;
    selectHandler: (item:any) => void;
}

const ItemWidget = ({__typename = "Item", name, exp_date, category, calories, quantity, checked, selectMode, deleteHandler, editHandler, selectHandler}: Props) => {
    // const {refresh, setRefresh} = useRefresh();
    const { refresh, expRefresh } = useRefresh();
    const [editMode, setEditMode] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedExpDate, setEditedExpDate] = useState(exp_date ? exp_date : 0);
    const [editedQuantity, setEditedQuantity] = useState(quantity && 1);
    const cur_date = new Date(Date.now() / 1000).getTime();
    const exp_diff = (exp_date != 0 && exp_date != null)? new Date(exp_date).getTime() : 999;

    // Calculate the difference between current time and expiration date
    const [tillExp, setTillExp] = useState((exp_date != 0 && exp_date != null) ? (exp_diff - cur_date) * 0.0000115741 : 999);
    // console.log(tillExp);

    const handleCancel = () => {
        setEditMode(false);
        setEditedName(name);
        setEditedQuantity(quantity ?? 1);
        setEditedExpDate(exp_date ?? 0);
    }

    const handleSave = () => {
        // Convert editedExpDate back to timestamp if necessary
        // const date = new Date(editedExpDate.year, editedExpDate.month - 1, editedExpDate.day);
        // const timestamp = date.getTime() / 1000; /
        // const expDateTimestamp = editedExpDate ? new Date(editedExpDate).getTime() / 1000 : null;
        
        editHandler({
            name: editedName,
            quantity: editedQuantity,
            // category: editedCategory,
            // calories: editedCalories,
            exp_date: editedExpDate,
        });
        setEditedName(editedName);
        setEditedQuantity(editedQuantity && 1);
        setEditedExpDate(editedExpDate ? editedExpDate : 0);
        setEditMode(false);
        if (editedExpDate != 0 && editedExpDate != null) {
            const cur_date = new Date(Date.now() / 1000).getTime();
            const exp_diff = new Date(editedExpDate).getTime();
            setTillExp((exp_diff - cur_date) * 0.0000115741);
        }
        else {
            setTillExp(9999);
        }
    };

    useEffect(() => {
        setTillExp((exp_date != 0 && exp_date != null) ? (exp_diff - cur_date) * 0.0000115741 : 999);
    }, [refresh, expRefresh, exp_date, cur_date, exp_diff]);

    return (<>
        {selectMode ? (
            <Pressable style={checked?  styles.select_container: tillExp < 0 ? styles.expired_item : styles.container} onPress={selectHandler}>
                <View style={styles.info}>                
                    <Text numberOfLines={1} style={styles.name}>{name}</Text>
                    {exp_date != 0 && exp_date != null && 
                        <View style={styles.wrapper}>
                            <View style={styles.label}>
                                <ExpirationIcon fill={tillExp < 5 ? "red" : "paleturquoise"} />
                            </View>
                            <Text style={{color: 'black'}}>
                                {new Date(exp_date * 1000).toLocaleDateString("en-US")}
                            </Text>
                            <Text style={(tillExp >= 0 && tillExp < 5)? {color:"red"} : {color: 'black'}}>
                                {(tillExp >= 0 && tillExp < 5)? ` (Expires in ${tillExp.toFixed(2)} Days)` :""}
                            </Text>
                        </View>
                    }

                    {quantity != 0 && quantity != null &&
                        <View style={styles.wrapper}>
                            <Text style={styles.label}>
                                Qty
                            </Text>
                            <Text>{quantity}</Text>
                        </View>
                    }
                </View>
            </Pressable>
        ) : editMode ? (
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
                        <View style={styles.wrapper}>
                            <View style={styles.label}>
                                <ExpirationIcon fill={'darkgray'}/>
                            </View>
                            <TouchableHighlight onPress={() => setCalendarOpen(!calendarOpen)} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.input}>
                                <Text >
                                    {editedExpDate != 0 ? new Date(editedExpDate * 1000).toLocaleDateString("en-US") : "Add Date"}
                                </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.wrapper}>
                            <Text style={{...styles.label, color: 'darkgray'}}>
                                Qty
                            </Text>
                            <TextInput
                                placeholder="Quantity"
                                onChangeText={(e) => setEditedQuantity(e != "" ? parseInt(e) : null)}
                                value={editedQuantity ? String(editedQuantity) : ""}
                                inputMode="numeric"
                                style={styles.input}
                            />
                        </View>
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
                <View style={tillExp < 0 ? styles.expired_item : styles.container}>
                    <View style={styles.info}>                
                        <Text numberOfLines={1} style={styles.name}>{name}</Text>
                        {exp_date != 0 && exp_date != null && 
                            <View style={styles.wrapper}>
                                <View style={styles.label}>
                                    <ExpirationIcon fill={tillExp < 5 ? "red" : "paleturquoise"} />
                                </View>
                                <Text style={{color: 'black'}}>
                                    {new Date(exp_date * 1000).toLocaleDateString("en-US")}
                                </Text>
                                <Text style={(tillExp >= 0 && tillExp < 5)? {color:"red"} : {color: 'black'}}>
                                    {(tillExp >= 0 && tillExp < 5)? ` (Expires in ${tillExp.toFixed(2)} Days)` :""}
                                </Text>
                            </View>
                        }

                        {category != '' && category != null && 
                            <View style={styles.wrapper}>
                                <View style={styles.label}>
                                    <CategoryIcon fill={"paleturquoise"}/>
                                </View>
                                <Text style={styles.detail}>{category}</Text>
                            </View>
                        }

                        {quantity != 0 && quantity != null &&
                            <View style={styles.wrapper}>
                                <Text style={styles.label}>
                                    Qty
                                </Text>
                                <Text style={styles.detail}>{quantity}</Text>
                            </View>
                        }

                        {calories != null && calories != '' && calories != '0' && calories != 'NaN' &&
                            <View style={styles.wrapper}>
                                <Text style={styles.label}>
                                    Cal
                                </Text>
                                <Text style={styles.detail}>{calories}</Text>
                            </View>
                        }
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableHighlight onPress={deleteHandler} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.button}>
                            <DeleteIcon />
                        </TouchableHighlight>
                        <TouchableHighlight 
                            onPress={() => {
                                setEditMode(true); 
                                setEditedName(name);
                                setEditedQuantity(quantity && 1);
                                setEditedExpDate(exp_date ? exp_date : 0);
                                // console.log(name, "is being edited.")
                                }}
                            activeOpacity={0.6} 
                            underlayColor="#DDDDDD" 
                            style={styles.button}
                        >
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
    select_container: {
        flex: 1,
        backgroundColor: 'darkturquoise',
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
    detail: {
        // height: 24,
        height: '100%',
        textAlignVertical: 'center',
    },
    input: {
        // height: '100%',
        verticalAlign: 'middle',
        // fontSize: 16,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        paddingHorizontal: 8,
        height: '100%',
        // backgroundColor: 'red',
        // flexGrow: 1,       
    },
    label: {
        width: 32,
        height: 24,
        borderRadius: 10,
        color: 'paleturquoise',
        fontWeight: 'bold',
        textAlign: 'center',
        // fontSize: 16,
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
    expired_item: {
        flex: 1,
        backgroundColor: 'lightcoral',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        marginTop: 5,
        marginHorizontal: 10,
        elevation: 2,
    }
})

export default ItemWidget;
