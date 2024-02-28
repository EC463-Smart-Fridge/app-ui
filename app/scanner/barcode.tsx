// import React, { useState } from 'react';
// import { StyleSheet, Button, Alert } from 'react-native';
// import { Text, View } from 'react-native';
// import { Camera, CameraType } from 'expo-camera';
// import { useFocusEffect } from '@react-navigation/native';

// export default function BarcodeScanner() {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scanned, setScanned] = useState<boolean>(false);

//   useFocusEffect(
//     React.useCallback(() => {
//       const requestCameraPermission = async () => {
//         const { status } = await Camera.requestCameraPermissionsAsync();
//         setHasPermission(status === 'granted');
//       };

//       requestCameraPermission();

//       return () => setHasPermission(null); // cleanup function
//     }, [])
//   );

//   const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
//     setScanned(true);
//     console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
//     // handle the scanned data
//     Alert.alert(
//       'Scan successful!',
//       `Bar code with type ${type} and data ${data} has been scanned!`,
//       [{ text: 'OK', onPress: () => setScanned(false) }]
//     );
//   };

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={styles.camera}
//         type={CameraType.front}
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//       />
//       {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   camera: {
//     flex: 1,
//   },
// });