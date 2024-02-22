import { Text, View, Pressable , TextInput, StyleSheet} from "react-native"
import React, { useState } from 'react'; 
import { Item } from '../src/models';
import XIcon from '../assets/icons/XIcon';

interface Props extends Item {
    deleteHandler: (item:any) => void;
    editHandler: (item:any) => void;
}

const ItemWidget = ({name, exp_date, category, calories, quantity, deleteHandler, editHandler}: Props) => {
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
        editHandler({
            name: editedName,
            quantity: parseInt(editedQuantity, 10),
            exp_date: expDateTimestamp,
        });
        setEditMode(false);
        setEditedName(editedName);
        setEditedQuantity(editedQuantity);
        setEditedExpDate(exp_date ? new Date(exp_date * 1000).toISOString().slice(0, 10) : "");
    };
    
    return (<>
            {editMode ? (
                <View style={styles.container}>
                    <View style={styles.info}>
                        <TextInput
                            style={styles.editInput}
                            onChangeText={setEditedName}
                            value={editedName ? (editedName) : ""}
                            inputMode="text"
                        />
                        <TextInput
                            style={styles.editInput}
                            onChangeText={setEditedQuantity}
                            value={editedQuantity}
                            inputMode="numeric"
                        />
                        <TextInput
                            style={styles.editInput}
                            onChangeText={setEditedExpDate}
                            value={editedExpDate}
                            // Assuming the date is in YYYY-MM-DD format
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Pressable onPress={handleSave}>
                            <Text>Save</Text>
                        </Pressable>
                        <Pressable onPress={handleCancel}>
                            <Text>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.info}>                
                        <Text style={styles.input}>{name}</Text>
                        {exp_date != 0 && exp_date != null && <Text style={styles.date}>Expires: {new Date(exp_date * 1000).toLocaleDateString("en-US")}</Text>}
                        {category != '' && category != null && <Text style={styles.category}>Category: {category}</Text>}
                        {quantity != 0 && quantity != null && <Text style={styles.quantity}>Quantity: {quantity}</Text>}
                        {calories != '' && calories != null &&  <Text style={styles.calories}>Calories: {calories}</Text>}
                    </View>

                    <View style={styles.buttonsContainer}>
                        <Pressable onPress={deleteHandler} style={styles.delete}>
                            <XIcon />
                        </Pressable>
                        <Pressable onPress={() => setEditMode(true)}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </>
    )
    
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'lightgray',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        marginVertical: 2,
    },
    // editContainer: {
    //     width: '100%',
    //     backgroundColor: 'lightgray',
    //     borderRadius: 10,
    //     padding: 8,
    //     marginVertical: 2,
    // },
    editInput: {
        height: 40,
        marginVertical: 8,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    input: {
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
    delete: {
        width: 24,
        borderRadius: 10,   
        display: 'flex',
        justifyContent: 'flex-start',
    },
    edit: {
        backgroundColor: 'lightblue',
        marginVertical: 2,
        marginBottom: 4,
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
    },
})

export default ItemWidget