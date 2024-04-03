import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Pressable, Switch } from 'react-native';
import { Text, View, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { addItemByUPC } from "../../../src/graphql/mutations";
import { useGraphQLClient, useUser } from "../../../contexts/GraphQLClientContext";
import SwapIcon from '../../../assets/icons/SwapIcon';
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements';



export default function SmartScan() {
  const client = useGraphQLClient();
  const { user, setUser } = useUser();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<Camera>(null);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(true);
  const [isProduce, setIsProduce] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);

  let resolvePromise: ((value: string[]) => void) | null = null;
  let rejectPromise: (() => void) | null = null;

  const handleCheckboxChange = (name: string) => {
    if (selectedNames.includes(name)) {
      setSelectedNames(prevNames => prevNames.filter(n => n !== name));
    } else {
      setSelectedNames(prevNames => [...prevNames, name]);
    }
  };

  useEffect(() => {
    if (!isModalVisible && resolvePromise && rejectPromise) {
      if (selectedNames.length > 0) {
        resolvePromise(selectedNames);
      } else {
        rejectPromise();
      }
      // Reset the promise functions
      resolvePromise = null;
      rejectPromise = null;
    }
  }, [isModalVisible, names]); // Include 'names' in the dependency array

  // Inside the 'showPopup' function, set the 'names' state when opening the modal
  const showPopup = async (names: string[]): Promise<string[]> => {
    //setNames(names);
    setIsModalVisible(true);
    console.log('Popup opened');
    return new Promise<string[]>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
  };

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
      let photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 }); // adjust quality for efficiency
      // console.log('Photo captured:', photo);

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
    const PAT = 'a82e73fa495c4c44942f78de03e45945'; // Replace with Clarifai PAT
    const MODEL_ID = 'food-item-recognition'; //'ocr-scene-english-paddleocr'; // Replace with Clarifai model ID
    const MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044'; //'46e99516c2d94f58baf2bcaf5a6a53a9'; // Replace with Clarifai model version ID

    if (user.isLoggedIn) {
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
        .then(async (result) => {
          // Extract prediction data from the response
          const outputs = result.outputs;
          if (outputs && outputs.length > 0) {
            const prediction = outputs[0]; // Assuming there's only one prediction
            const data = prediction.data;

            //let names = [];
            //for (let i = 0; i < 5; i++) {
            //names.push(String(data.concepts[i].name));
            //console.log(names[i]);
            //}
            setNames([String(data.concepts[0].name), String(data.concepts[1].name), String(data.concepts[2].name), String(data.concepts[3].name), String(data.concepts[4].name)]);
            // Show the popup with the names and get the selected names

            let selectedNames = await showPopup(names);
            console.log('Names:', names);
            console.log('Selected names:', selectedNames);

            // For every name in selected names, do the following:
            for (let name of selectedNames) {
              console.log(name + `${isProduce ? ' +raw' : ''}`)
              try {
                const addResult = await client.graphql({
                  query: addItemByUPC,
                  variables: {
                    uid: user.userId,
                    upc: name + `${isProduce ? ' +raw' : ''}`,
                    name: name
                  },
                })

                console.log('Item added successfully', addResult);
              } catch (error) {
                console.error('Error adding item', error);
              }
            }

            // Log prediction details to the console
            console.log('Prediction:');
            console.log('Top 5: ', data.concepts[0].name, data.concepts[1].name, data.concepts[2].name, data.concepts[3].name, data.concepts[4].name);
            console.log('Classes:', data.concepts.map((concept: any) => concept.name).join(', ')); // Assuming concepts contain predicted classes
            console.log('Probabilities:', data.concepts.map((concept: any) => concept.value).join(', ')); // Assuming concepts contain probabilities
          } else {
            console.log('No prediction outputs found.');
          }
        })
        .catch(error => console.error('Error:', error));
    }
    else {
      console.log("No user logged in")
    }
  };

  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (user.isLoggedIn ?
    <View style={styles.container}>

      <Modal isVisible={isModalVisible}>
        <View style={{ backgroundColor: 'white', padding: 20 }}>
          <Text>Select items</Text>
          {names.map(name => (
            <CheckBox
              key={name}
              title={name}
              checked={selectedNames.includes(name)}
              onPress={() => handleCheckboxChange(name)}
            />
          ))}
          <Button title="Done" onPress={() => {
            setIsModalVisible(false);
            resolvePromise?.(selectedNames); // Optional chaining here
          }}>
          </Button>
          <Button title="Cancel" onPress={() => {
            setIsModalVisible(false);
            rejectPromise?.(); // Optional chaining here
          }}>
          </Button>
        </View>
      </Modal>


      <Camera style={styles.camera} ref={cameraRef} type={isFrontCamera ? CameraType.front : CameraType.back} />
      <View style={styles.buttonContainer}>
        <View style={styles.leftButtons}>
          <Pressable onPress={() => setIsFrontCamera(!isFrontCamera)} style={styles.swap}><SwapIcon fill={"darkturquoise"} /></Pressable>
          {/* <Pressable onPress={() => setIsFrontCamera(!isFrontCamera)} style={styles.swap}><SwapIcon /></Pressable> */}
        </View>

        <View style={styles.captureContainer}>
          <Pressable onPress={handleCapture} style={({ pressed }) => [{ backgroundColor: pressed ? 'darkturquoise' : 'whitesmoke', }, styles.capture]}></Pressable>
        </View>

        <View style={styles.toggle}>
          <Text style={styles.produce}>Produce</Text>
          <Switch
            trackColor={{ false: 'darkgray', true: 'darkturquoise' }}
            thumbColor='white'
            // ios_backgroundColor="#3e3e3e"
            onValueChange={() => { setIsProduce(!isProduce); }}
            value={isProduce}
          />
        </View>
      </View>
    </View>
    :
    <View>
      <Text>Not logged in</Text>
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
  leftButtons: {
    flexDirection: 'row',
    columnGap: 8,
  },
  toggle: {
    borderColor: 'lightgray',
    borderWidth: 2,
    padding: 8,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  produce: {
    color: 'darkturquoise',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    margin: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    width: '100%',
  },
  swap: {
    borderColor: 'lightgray',
    borderWidth: 2,
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
    padding: 4,
  },
  capture: {
    borderWidth: 4,
    borderColor: 'darkturquoise',
    padding: 10,
    borderRadius: 20,
    height: 40,
    aspectRatio: 1,
  }
});


