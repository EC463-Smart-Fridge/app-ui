import React, { useState } from 'react';
import { StyleSheet, Button, Alert } from 'react-native';
import { Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { addItem, addItemByUPC } from '../../src/graphql/mutations'; 
import { useGraphQLClient } from '../../contexts/GraphQLClientContext';

export default function BarcodeScanner() {
  const client = useGraphQLClient();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      };

      requestCameraPermission();

      return () => setHasPermission(null); // cleanup function
    }, [])
  );

  const handleBarCodeScanned = async ({ type, data }: { type: any; data: any }) => {
    setScanned(true);
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    // handle the scanned data
    Alert.alert(
      'Scan successful!',
      `Bar code with type ${type} and data ${data} has been scanned!`,
      [{ text: 'OK', onPress: () => setScanned(false) }]
    );

    try {
        const addResult = await client.graphql({
            query: addItemByUPC,
            variables: {
                uid: 'UID1',
                upc: String(data) 
            },
        })
        console.log('Item added successfully', addResult);
    } catch (error) {
        console.error('Error adding item', error);
    }
    
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={CameraType.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
});