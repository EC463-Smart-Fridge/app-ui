import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
};

export default function Login({ navigation }: Props) {
  // Placeholder function for login
  const handleLogin = () => {
    console.log('Login button pressed');
  };

  const continueAsGuest = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Button title="Log In" onPress={handleLogin} />
      <Button title="Continue as a Guest" onPress={continueAsGuest} />
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
});
