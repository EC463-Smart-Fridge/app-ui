import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Pressable, Alert } from 'react-native';
import { Text, View } from 'react-native';
import { Code, Camera, useCameraDevice } from 'react-native-vision-camera'; // Import useCameraDevice
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { addItemByUPC } from "../../../src/graphql/mutations";
import { getItemPredictions } from '../../../src/graphql/queries';
import { useGraphQLClient } from "../../../contexts/GraphQLClientContext";
import { useUser } from "../../../contexts/UserContext";
import { Prediction } from '../../../src/API';
import { Modal } from 'react-native';
import SwapIcon from '../../../assets/icons/SwapIcon';
import AddIcon from '../../../assets/icons/AddIcon';
import DeleteIcon from '../../../assets/icons/DeleteIcon';
import Spinner from '../../../components/Spinner';

export default function SmartScan() {
  // const client = useGraphQLClient();
  // const {user} = useUser();
  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // const cameraRef = useRef<Camera>(null);
  // const [isFrontCamera, setIsFrontCamera] = useState<boolean>(true);
  const client = useGraphQLClient();
  const { user } = useUser();
  const [torch, setTorch] = useState<boolean>(false);
  const cameraRef = useRef<Camera>(null)
  const isFocused = useIsFocused();
  const [device, setDevice] = useState('back'); // Use 'back' as the default camera device
  const toggleCamera = () => setDevice(device === 'back' ? 'front' : 'back');
  const frontCamera = useCameraDevice('front');
  const backCamera = useCameraDevice('back');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPermission() {
      const newCameraPermission = await Camera.requestCameraPermission();
      console.log(newCameraPermission);
    }
    getPermission();
  }, []);

  const handleCapture = async() => {
    try {
      setLoading(true);
      const file = await cameraRef.current!.takePhoto({enableShutterSound: false});
      const result = await fetch(`file://${file.path}`)
      const data = await result.blob();
      console.log(data)
    } catch (error) {
      console.error('Failed to capture photo', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCapture2 = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePhoto()
      console.log(photo)
      // Prepare the image data to pass to the Clarifai API
      // const imageBase64 = photo.base64 ? photo.base64 : '';
      const imageBase64 = photo ? photo : '';

      if (imageBase64 == '') {
        console.log('Failed to capture item image');
      } else {
        // Make the API request to Clarifai

        if (user.isLoggedIn) {
          setLoading(true);
          
          try {
            // Run the GraphQL query for item predictions using Clarifai
            const result = await client.graphql({
              query: getItemPredictions,
              variables: {
                image: imageBase64,
              }
            })

            if (result.data && result.data.getItemPredictions) {
              // Extract prediction data from the response
              const outputs : Prediction[] = result.data.getItemPredictions;
              if (outputs && outputs.length > 0) {

                setItems(outputs.map((item => String(item.name))))
                setIsModalVisible(true)
              } else {
                console.log('No prediction outputs found.');
                Alert.alert(  
                  'Sorry :(',  
                  'No results found. Please try again.',  
                  [  
                      {  
                          text: 'OK',  
                          onPress: () => console.log('Cancel Pressed'),  
                          style: 'cancel',  
                      }
                  ],
                  {cancelable: true}
                  );  
                }
            }
            else {
              console.log("No item predictions found");
            }
          }
          catch (error) {
            console.log("Failed to get item predictions", error);
          }
          finally {
            setLoading(false);
          }
        }
        else {
          console.log("Error: No user logged in");
        }

      }
    }
  };

  const handleAddItem = async () => {
    if (!user.isLoggedIn) {
      return;
    }
    try {
      const addResult = async () => {
        setLoading(true);
        try {
          const promises = selectedItems.map(async (item) => {
            console.log('Adding item', item);
      
            const data = await client.graphql({
              query: addItemByUPC,
              variables: {
                uid: user.userId,
                upc: item,
                name: item,
              },
            });
      
            console.log('Item added successfully', data);
          });
      
          await Promise.all(promises);
        } catch (error) {
          console.error('Error adding items:', error);
        } finally {
          setLoading(false);
        }
      };
      
      addResult();

    } catch (error) {
        console.error('Error adding item', error);
    } finally {
      setSelectedItems([])
      setItems([])
      setIsModalVisible(false)
    }
}

  if (!user.isLoggedIn) {
    <View>
      <Text>Not logged in</Text>
    </View>
  }

  if (loading || !isFocused) {
    return (
      <View style={styles.modalBackground}>
        <Spinner />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      {isModalVisible && 
          <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            style={styles.modal}
          >
            <View style={styles.selection}>
              <Text style={styles.itemWrapper}>Results: </Text>
              <View style={{height: 1, width: '100%', backgroundColor: 'lightgray'}}></View>
              {items.map((item, index) => 
                <Pressable key={index} onPress={() => {
                  if (selectedItems.includes(item)) {
                    setSelectedItems(selectedItems.filter((i) => i !== item))
                  }  else {
                    setSelectedItems([...selectedItems, item])
                  }
                }}
                style={{...styles.itemWrapper, backgroundColor: selectedItems.includes(item) ? 'lightgray' : 'transparent'}}
                >
                  <Text style={styles.item}>{item}</Text>
                </Pressable>
              )}
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Pressable 
                  onPress={() => {setIsModalVisible(false); setSelectedItems([]), setItems([])}}
                  style={({pressed}) => [{backgroundColor: pressed ? 'indianred' : 'lightcoral', }, styles.cancel,]}
                >
                  <DeleteIcon/>
                </Pressable>
                <Pressable 
                  onPress={handleAddItem}
                  style={({pressed}) => [{backgroundColor: pressed ? 'darkturquoise' : 'paleturquoise', }, styles.confirm,]}
                >
                  <AddIcon/>
                </Pressable>
              </View>
            </View>
          <Pressable onPress={() => {setIsModalVisible(false); setSelectedItems([])}} style={styles.modalBackground}></Pressable>
          </Modal>
      }
    {device === 'back' && backCamera != null ?
    <Camera
      style={styles.camera}
      device={backCamera}
      isActive={isFocused}
      torch={torch ? 'on' : 'off'}
      enableZoomGesture={true}
      photo={true}
      ref={cameraRef}
    />
    : device === 'front' && frontCamera != null ?
    <Camera
      style={styles.camera}
      device={frontCamera}
      isActive={isFocused}
      torch={torch ? 'on' : 'off'}
      enableZoomGesture={true}
      photo={true}
      ref={cameraRef}
    />
    :
    <></>

    }
    <Pressable onPress={handleCapture} style={({pressed}) => [{backgroundColor: pressed ? 'darkturquoise' : 'transparent', },styles.capture]}></Pressable>
    <Pressable onPress={toggleCamera} style={styles.swap}><SwapIcon fill='darkturquoise'/></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemWrapper: {
    padding: 10,
    fontSize: 18,
    height: 44,
    textAlign: 'center',
  },
  item: {
    height: '100%',
    fontSize: 18,
    textAlign: 'center',
  },
  selection: {
    // position: 'absolute',
    zIndex: 100,
    // height: 400,
    width: '85%',
    marginHorizontal: 20,
    alignSelf: 'center',
    marginTop: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  modal: {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalBackground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel: {
    height: 40,
    width: '50%',
    borderBottomLeftRadius: 12,
    padding: 8,
  },  
  confirm: {
    height: 40,
    width: '50%',
    borderBottomRightRadius: 12,
    padding: 8,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  leftButtons: {
    flexDirection: 'row',
    columnGap: 8,
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
    zIndex: 200,
  },
  capture: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'darkturquoise',
    padding: 10,
    borderRadius: 20,
    height: 40,
    aspectRatio: 1,
    bottom: 10,
  }
});