import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Button, Alert, View } from 'react-native';
import { Code, Camera, useCameraDevice } from 'react-native-vision-camera'; // Import useCameraDevice
import { useFocusEffect } from '@react-navigation/native';
import { addItemByUPC } from '../../../src/graphql/mutations'; 
import { useGraphQLClient, useUser } from '../../../contexts/GraphQLClientContext';

export default function BarcodeScanner() {
  const client = useGraphQLClient();
  const { user } = useUser();
  const [torch, setTorch] = useState<boolean>(false);
  const [isShowingAlert, setIsShowingAlert] = useState<boolean>(false);
  
  // Retrieve camera device
  const device = useCameraDevice('back'); // Use 'back' as the default camera device

  // Function to handle the barcode scan
  const onCodeScanned = useCallback((codes: Code[]) => {
    if (!isShowingAlert && codes.length > 0 && codes[0].value) {
      setIsShowingAlert(true);
      Alert.alert(
        'Scan successful!',
        `Barcode value: ${codes[0].value}`,
        [{ text: 'OK', onPress: () => setIsShowingAlert(false) }]
      );
      
      if (user.isLoggedIn) {
        handleBarcodeData(codes[0].value);
      }
    }
  }, [isShowingAlert, user]);

  // Function to handle barcode data (GraphQL mutation)
  const handleBarcodeData = async (barcodeData: string) => {
    try {
      const addResult = await client.graphql({
        query: addItemByUPC,
        variables: {
          uid: user.userId,
          upc: barcodeData
        },
      });
      console.log('Item added successfully', addResult);
    } catch (error) {
      console.error('Error adding item', error);
    }
  };

  // Effect hook to handle focus changes
  useFocusEffect(
    React.useCallback(() => {
      return () => setIsShowingAlert(false); // cleanup function
    }, [])
  );

  if (!device) {
    return <View />; // Return null or any fallback UI if camera device is not available
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true} // Always active
        codeScanner={{ onCodeScanned, codeTypes: ['upc-a'] }}
        torch={torch ? 'on' : 'off'}
        enableZoomGesture={true}
      />
      <Button title={torch ? 'Turn off torch' : 'Turn on torch'} onPress={() => setTorch(prev => !prev)} />
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
