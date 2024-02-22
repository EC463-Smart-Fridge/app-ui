import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BarcodeScanner from './BarcodeScanner';
import SmartScanner from './SmartScanner';

const Tab = createBottomTabNavigator();

const ScanNav: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="BarcodeScanner" component={BarcodeScanner} />
      <Tab.Screen name="SmartScanner" component={SmartScanner} />
    </Tab.Navigator>
  );
};

export default ScanNav;
