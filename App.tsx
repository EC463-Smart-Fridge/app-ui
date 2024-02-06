import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from './screens/Home';
import Scan from './screens/Scan';
import Recipes from './screens/Recipe';
import Login from './screens/Login'; 

// Define types for your navigation structure
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

type MainTabParamList = {
  Items: undefined;
  Scan: undefined;
  Recipes: undefined;
};

// Create the navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createMaterialTopTabNavigator<MainTabParamList>();

// Component for the Main Tabs
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Items" component={Home} />
      <Tab.Screen name="Scan" component={Scan} />
      <Tab.Screen name="Recipes" component={Recipes} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
