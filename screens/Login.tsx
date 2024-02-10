import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
};

export default function Login({ navigation }: Props) {
  // Placeholder function for login
  const handleLogin = () => {
    console.log('Login Pressable pressed');
  };

  const continueAsGuest = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text>
          Login
        </Text>
      </Pressable>
      <Pressable onPress={continueAsGuest} style={styles.button}>
        <Text>
          Continue as Guest
        </Text>
      </Pressable>
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
