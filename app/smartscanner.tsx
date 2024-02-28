import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';

export default function SmartScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<Camera>(null);

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

  const handleCapture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 }); // adjust quality for efficiency
      console.log('Photo captured:', photo);
  
      // Prepare the image data to pass to the Clarifai API
      const imageBase64 = photo.base64;
      const clarifaiRequestBody = JSON.stringify({
        "inputs": [
          {
            "data": {
              "image": {
                "base64": imageBase64
              }
            }
          }
        ]
      });
  
      // Make the API request to Clarifai
      fetchClarifaiAPI(clarifaiRequestBody);
    }
  };
  
  const fetchClarifaiAPI = (requestData: string) => {
    const PAT = 'b0cfb19838e1432e8453961933c40cb5'; // Replace with Clarifai PAT
    const MODEL_ID = 'food-item-recognition'; //'ocr-scene-english-paddleocr'; // Replace with Clarifai model ID
    const MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044'; //'46e99516c2d94f58baf2bcaf5a6a53a9'; // Replace with Clarifai model version ID
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: requestData
    };
  
    /*fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    */

    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions)
    .then(response => response.json())
    .then(result => {
      // Extract prediction data from the response
      const outputs = result.outputs;
      if (outputs && outputs.length > 0) {
        const prediction = outputs[0]; // Assuming there's only one prediction
        const data = prediction.data;

        // Log prediction details to the console
        console.log('Prediction:');
        console.log('Classes:', data.concepts.map((concept: any) => concept.name).join(', ')); // Assuming concepts contain predicted classes
        console.log('Probabilities:', data.concepts.map((concept: any) => concept.value).join(', ')); // Assuming concepts contain probabilities
      } else {
        console.log('No prediction outputs found.');
      }
    })
    .catch(error => console.error('Error:', error));
  };
  
  
  

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} />
      <Button title="Capture" onPress={handleCapture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
});