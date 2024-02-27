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
                    options={{ headerShown: false, href: null,}}
                />
                <Tabs.Screen
                    name="home"
                    options={{ headerShown: false}}
                />
                <Tabs.Screen
                    name="scan"
                    options={{ headerShown: false}}
                />
                <Tabs.Screen
                    name="recipes"
                    options={{ headerShown: false}}
                />
            </Tabs>
        </GraphQLClientProvider>
    )
}