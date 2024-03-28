import { router } from 'expo-router';
import React from 'react';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';

export default function Login() {
  // Placeholder function for login
  const handleLogin = () => {
    console.log('Login TouchableHighlight pressed');
  };


  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={handleLogin} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.button}>
        <Text>
          Login
        </Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => router.replace('/home')} activeOpacity={0.6} underlayColor="#DDDDDD" style={styles.button}>
        {/* <Link href="/home"> */}
          {/* <TouchableHighlight style={styles.button}> */}
            <Text>
          Continue as Guest
            </Text>
          {/* </TouchableHighlight> */}
        {/* </Link> */}
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    backgroundColor: 'lightgray',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
});
