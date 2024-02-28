import { Slot, Tabs } from "expo-router";
import { View } from "react-native";
import { GraphQLClientProvider } from "../contexts/GraphQLClientContext";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
    return (
        <GraphQLClientProvider>
            {/* TEMP TOP BAR */}
            <View style={{height: 50, width: "100%"}}></View>
            {/* <StatusBar style="auto" /> */}
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{ href: null, headerShown: false}}
                />
                <Tabs.Screen
                    name="home"
                    options={{ tabBarLabel: "Home", headerShown: false}}
                />
                <Tabs.Screen
                    name="barcode"
                    options={{ tabBarLabel: "Barcode", headerShown: false, }}
                />
                <Tabs.Screen
                    name="smartscanner"
                    options={{ tabBarLabel: "Smart Scan", headerShown: false, }}
                />
                <Tabs.Screen
                    name="recipes"
                    options={{ tabBarLabel: "Recipes", headerShown: false}}
                />
            </Tabs>
        </GraphQLClientProvider>
    )
}