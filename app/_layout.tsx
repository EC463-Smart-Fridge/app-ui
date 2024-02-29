import { Slot, Tabs } from "expo-router";
import { View } from "react-native";
import { GraphQLClientProvider } from "../contexts/GraphQLClientContext";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import HomeIcon from "../assets/icons/HomeIcon";
import CakeIcon from "../assets/icons/CakeIcon";
import ScanIcon from "../assets/icons/ScanIcon";
import SettingsIcon from "../assets/icons/SettingsIcon";

export default function Layout() {
    return (
        <GraphQLClientProvider>
            {/* TEMP TOP BAR */}
            <View style={{height: 50, width: "100%"}}></View>
            {/* <StatusBar style="auto" /> */}
            {/* <View style={{flex: 1, backgroundColor: 'blue'}}> */}
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{ href: null, headerShown: false}}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="home"
                    options={{ tabBarLabel: "Home", headerShown: false, tabBarIcon: HomeIcon, tabBarLabelPosition: 'below-icon'}}
                />
                <Tabs.Screen
                    name="barcode"
                    options={{ tabBarLabel: "Barcode", headerShown: false, tabBarIcon: ScanIcon, tabBarLabelPosition: 'below-icon'}}
                />
                <Tabs.Screen
                    name="smartscanner"
                    options={{ tabBarLabel: "Smart Scan", headerShown: false, tabBarIcon: ScanIcon, tabBarLabelPosition: 'below-icon'}}
                />
                <Tabs.Screen
                    name="recipes"
                    options={{ tabBarLabel: "Recipes", headerShown: false, tabBarIcon: CakeIcon, tabBarLabelPosition: 'below-icon'}}
                />
                <Tabs.Screen
                    name="settings"
                    options={{ tabBarLabel: "Settings", headerShown: false, tabBarIcon: SettingsIcon, tabBarLabelPosition: 'below-icon'}}
                />
            </Tabs>
            {/* </View> */}
        </GraphQLClientProvider>
    )
}