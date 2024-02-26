import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from './app/index';
import Scan from './app/scan';
import Recipes from './app/recipes';
import Login from './app/home'; 
import { GraphQLClientProvider } from './contexts/GraphQLClientContext';

// const client = generateClient();
// Amplify.configure(awsmobile);
// export default const client;

// Define types for your navigation structure
// type RootStackParamList = {
//   Login: undefined;
//   Main: undefined;
// };

// type MainTabParamList = {
//   Items: undefined;
//   Scan: undefined;
//   Recipes: undefined;
// };

// Create the navigators
// const Stack = createStackNavigator<RootStackParamList>();
// const Tab = createMaterialTopTabNavigator<MainTabParamList>();

export default function App() {
  return (
    <GraphQLClientProvider>
      <Home />
    </GraphQLClientProvider>
  )
}

// Component for the Main Tabs
// function MainTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Items" component={Home} />
//       <Tab.Screen name="Scan" component={Scan} />
//       <Tab.Screen name="Recipes" component={Recipes} />
//     </Tab.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <GraphQLClientProvider>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 },} }>
//           <Stack.Screen name="Login" component={Login} />
//           <Stack.Screen name="Main" component={MainTabs} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </GraphQLClientProvider>
//   );
// }
