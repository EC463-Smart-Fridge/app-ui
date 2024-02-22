import { Text, View, Pressable , TextInput, StyleSheet} from "react-native"
import React, { useState } from 'react'; 
import { Item } from '../src/models';
import XIcon from '../assets/icons/XIcon';

interface Props extends Item {
    delete_handler: (item:any) => void;
    edit_handler: (item:any) => void;
}

const ItemWidget = ({name, exp_date, category, calories, quantity, delete_handler, edit_handler}: Props) => {
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedQuantity, setEditedQuantity] = useState(quantity ? quantity.toString() : "");
    const [editedExpDate, setEditedExpDate] = useState(exp_date ? new Date(exp_date * 1000).toISOString().slice(0, 10) : "");

    const handleCancel = () => {
        setEditMode(false);
        setEditedName(name);
        setEditedQuantity(quantity ? quantity.toString() : "");
        setEditedExpDate(exp_date ? new Date(exp_date * 1000).toISOString().slice(0, 10) : "");
    }

    const handleSave = () => {
        // Convert editedExpDate back to timestamp if necessary
        const expDateTimestamp = editedExpDate ? new Date(editedExpDate).getTime() / 1000 : null;
        edit_handler({
            name: editedName,
            quantity: parseInt(editedQuantity, 10),
            exp_date: expDateTimestamp,
        });
        setEditMode(false);
        setEditedName(editedName);
        setEditedQuantity(editedQuantity);
        setEditedExpDate(exp_date ? new Date(exp_date * 1000).toISOString().slice(0, 10) : "");
    };
    
    return (
        <div>
            {editMode ? (
                <>
                    <View style={styles.edit_container}>
                        <TextInput
                            style={styles.edit_input}
                            onChangeText={setEditedName}
                            value={editedName ? (editedName) : ""}
                            inputMode="text"
                        />
                        <TextInput
                            style={styles.edit_input}
                            onChangeText={setEditedQuantity}
                            value={editedQuantity}
                            inputMode="numeric"
                        />
                        <TextInput
                            style={styles.edit_input}
                            onChangeText={setEditedExpDate}
                            value={editedExpDate}
                            // Assuming the date is in YYYY-MM-DD format
                            placeholder="YYYY-MM-DD"
                        />
                        <View style={styles.buttonsContainer}>
                            <Pressable onPress={handleSave}>
                                <Text>Save</Text>
                            </Pressable>
                            <Pressable onPress={handleCancel}>
                                <Text>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.container}>
                        <View style={styles.info}>                
                            <Text style={styles.input}>{name}</Text>
                            {exp_date != 0 && exp_date != null && <Text style={styles.date}>Expires: {new Date(exp_date * 1000).toLocaleDateString("en-US")}</Text>}
                            {category != '' && <Text style={styles.category}>Category: {category}</Text>}
                            {quantity != 0 && <Text style={styles.quantity}>Quantity: {quantity}</Text>}
                            {calories != '0' && <Text style={styles.calories}>Calories: {calories}</Text>}
                        </View>

                        <View style={styles.actionButtons}>
                            <Pressable onPress={delete_handler} style={styles.delete}>
                                <XIcon />
                            </Pressable>
                            <Pressable onPress={() => setEditMode(true)}>
                                <Text>Edit</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            )}
        </div>
    )
    
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        backgroundColor: 'lightgray',
        opacity: 0.5, 
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        marginVertical: 2,
    },
    edit_container: {
        width: '100%',
        backgroundColor: 'lightgray',
        borderRadius: 10,
        padding: 8,
        marginVertical: 2,
    },
    edit_input: {
        height: 40,
        marginVertical: 8,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    input: {
        // height: '100%',
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
    calories: {
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        height: '100%',
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
    delete: {
        width: 24,
        height: '100%',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    edit: {
        backgroundColor: 'lightblue',
        marginVertical: 2,
        marginBottom: 4,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButtons: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
})

export default ItemWidget