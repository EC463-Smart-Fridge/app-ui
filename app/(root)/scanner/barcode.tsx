import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Button, Alert, View, Pressable, Text } from 'react-native';
// import { Code, Camera, useCameraDevice } from 'react-native-vision-camera'; // Import useCameraDevice
import { useFocusEffect } from '@react-navigation/native';
import { addItemByUPC } from '../../../src/graphql/mutations'; 
import { useGraphQLClient, useUser } from '../../../contexts/GraphQLClientContext';
import SwapIcon from '../../../assets/icons/SwapIcon';

export default function BarcodeScanner() {
  // const client = useGraphQLClient();
  // const { user } = useUser();
  // const [torch, setTorch] = useState<boolean>(false);
  // const [isShowingAlert, setIsShowingAlert] = useState<boolean>(false);
  
  // // Retrieve camera device
  // //const device = useCameraDevice('back'); // Use 'back' as the default camera device
  // const [device, setDevice] = useState('back'); // Use 'back' as the default camera device
  // const toggleCamera = () => setDevice(device === 'back' ? 'front' : 'back');
  // const frontCamera = useCameraDevice('front');
  // const backCamera = useCameraDevice('back');

  // // Function to handle the barcode scan
  // const onCodeScanned = useCallback((codes: Code[]) => {
  //   //console.log('Barcode scanned:', codes[0].value);
  //   if (!isShowingAlert && codes.length > 0 && codes[0].value) {
      
  //     setIsShowingAlert(true);
  //     Alert.alert(
  //       'Scan successful!',
  //       `Barcode value: ${codes[0].value}`,
  //       [{ text: 'OK', onPress: () => setIsShowingAlert(false) }]
  //     );
      
  //     if (user.isLoggedIn) {
  //       handleBarcodeData(String(codes[0].value));
  //     }
  //   }
  // }, [isShowingAlert, user]);

  // // Function to handle barcode data (GraphQL mutation)
  // const handleBarcodeData = async (barcodeData: string) => {
  //   try {
  //     console.log('Adding item to user:', barcodeData);
  //     const addResult = await client.graphql({
  //       query: addItemByUPC,
  //       variables: {
  //         uid: user.userId,
  //         upc: barcodeData,
  //         name: ''
  //       },
  //     });
  //     console.log('Item added successfully', addResult);
  //   } catch (error) {
  //     console.error('Error adding item', error);
  //   }
  // };

  // // Effect hook to handle focus changes
  // useFocusEffect(
  //   React.useCallback(() => {
  //     return () => setIsShowingAlert(false); // cleanup function
  //   }, [])
  // );

  // if (!device) {
  //   return <View />; // Return null or any fallback UI if camera device is not available
  // }

  return 
  // (
  //   <View style={styles.container}>
  //   {
  //     (device === 'back' && backCamera != null) ? 
  //     <Camera
  //       style={styles.camera}
  //       device={backCamera}
  //       isActive={true} // Always active
  //       codeScanner={{ onCodeScanned, codeTypes: ['upc-a'] }}
  //       torch={torch ? 'on' : 'off'}
  //       enableZoomGesture={true}
  //     />
  //     : (device === 'front' && frontCamera != null) ?
  //     <Camera
  //       style={styles.camera}
  //       device={frontCamera}
  //       isActive={true} // Always active
  //       codeScanner={{ onCodeScanned, codeTypes: ['upc-a'] }}
  //       torch={torch ? 'on' : 'off'}
  //       enableZoomGesture={true}
  //     />
  //     :
  //     <></>
  //   }
  //   <Pressable onPress={toggleCamera} style={styles.swap}><SwapIcon fill='darkturquoise'/></Pressable>
  // </View>
  // );
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
  swap: {
    borderColor: 'darkturquoise',
    backgroundColor: 'transparent',
    borderWidth: 2,
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
    padding: 4,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});
