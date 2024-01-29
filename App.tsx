import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar } from 'expo-status-bar';
import Home from './screens/Home';
// import Scan from './screens/Scan';
// import Recipes from './screens/Recipes';

export default function App() {

  const Tab = createMaterialTopTabNavigator();

  return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Items" component={Home} />
          {/* <Tab.Screen name="Scan" component={Scan} />
          <Tab.Screen name="Recipes" component={Recipes} /> */}
        </Tab.Navigator>
      </NavigationContainer>
  )
}