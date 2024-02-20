import React, { useState } from "react";
import { Text, View, Pressable, TextInput, StyleSheet, Button } from "react-native";
import { Item } from '../src/models';

interface Props extends Item {
    onSave: (item: Partial<Item>) => void; // Updated to include onSave handler for saving edits
    onCancel: () => void; // Handler for canceling edits
}

const EditItemWidget: React.FC<Props> = ({ name, exp_date, quantity, onSave, onCancel }) => {
    const [editedName, setEditedName] = useState(name);
    const [editedQuantity, setEditedQuantity] = useState(quantity ? quantity.toString() : "");
    const [editedExpDate, setEditedExpDate] = useState(exp_date ? new Date(exp_date * 1000).toISOString().slice(0, 10) : "");

    const handleSave = () => {
        // Convert editedExpDate back to timestamp if necessary
        const expDateTimestamp = editedExpDate ? new Date(editedExpDate).getTime() / 1000 : null;
        onSave({
            name: editedName,
            quantity: parseInt(editedQuantity, 10),
            exp_date: expDateTimestamp,
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setEditedName}
                value={editedName}
            />
            <TextInput
                style={styles.input}
                onChangeText={setEditedQuantity}
                value={editedQuantity}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                onChangeText={setEditedExpDate}
                value={editedExpDate}
                // Assuming the date is in YYYY-MM-DD format
                placeholder="YYYY-MM-DD"
            />
            <View style={styles.buttonsContainer}>
                <Button title="Save" onPress={handleSave} />
                <Button title="Cancel" onPress={onCancel} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'lightgray',
        borderRadius: 10,
        padding: 8,
        marginVertical: 2,
    },
    input: {
        height: 40,
        marginVertical: 8,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default EditItemWidget;
