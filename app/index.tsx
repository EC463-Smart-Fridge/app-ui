import { Link } from 'expo-router';
import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';

export default function Login() {
  // Placeholder function for login
  const handleLogin = () => {
    console.log('Login Pressable pressed');
  };


  return (
    <View style={styles.container}>
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text>
          Login
        </Text>
      </Pressable>
      <Link href="/home" style={styles.button}>
        {/* <Pressable style={styles.button}>
          <Text> */}
        Continue as Guest
          {/* </Text>
        </Pressable> */}
      </Link>
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
