import { Slot, Tabs } from "expo-router";

export default function Layout() {
    return (
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
    )
}