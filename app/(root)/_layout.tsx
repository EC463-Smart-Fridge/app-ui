import { Stack, Tabs } from "expo-router";
import { View, Text } from "react-native";
import { GraphQLClientProvider, UserProvider, useUser} from "../../contexts/GraphQLClientContext";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import HomeIcon from "../../assets/icons/HomeIcon";
// import CakeIcon from "../assets/icons/CakeIcon";
import RecipeIcon from "../../assets/icons/RecipeIcon";
import ScanIcon from "../../assets/icons/ScanIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";
import { useEffect, useState } from "react";

const initState = {
    isLoggedIn: false,
    userId: '',
    username: '',
    email: '',
    name: ''
  }


export default function Layout() {
    const user = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState();
    useEffect(() => {
        setIsLoggedIn(user.isLoggedIn);
        console.log(user.isLoggedIn);
    }, [user.isLoggedIn])

    return (!isLoggedIn ?
        <>
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        paddingTop: 4,
                        paddingBottom: 4,
                    },
                    headerShown: false,
                    tabBarLabelPosition: 'below-icon',
                    tabBarActiveTintColor: 'darkturquoise',
                }}
            >
                <Tabs.Screen
                    name="auth"    
                    options={{ href: null, headerShown: false}}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="home"
                    options={{ tabBarLabel: "Home", tabBarIcon: ({focused}) => <HomeIcon fill={focused ? 'darkturquoise' : 'black'} />}}
                />
                <Tabs.Screen
                    name="scanner"
                    options={{ tabBarLabel: "Scan", tabBarIcon: ({focused}) => <ScanIcon fill={focused ? 'darkturquoise' : 'black'}/>}}
                />
                <Tabs.Screen
                    name="recipes"
                    options={{ tabBarLabel: "Recipes", tabBarIcon: ({focused}) => <RecipeIcon fill={focused ? 'darkturquoise' : 'black'}/>}}
                />
                <Tabs.Screen
                    name="settings"
                    options={{ tabBarLabel: "Settings", tabBarIcon: ({focused}) => <SettingsIcon fill={focused ? 'darkturquoise' : 'black'}/>}}
                />
                <Tabs.Screen
                    name="barcode"
                    options={{ tabBarLabel: "barcode", tabBarIcon: ({focused}) => <SettingsIcon fill={focused ? 'darkturquoise' : 'black'}/>}}
                />
            </Tabs>
        </> : 
        // <Stack>
        //     <Stack.Screen
        //         name="auth"
        //     ></Stack.Screen>
        // </Stack>
        <View>
            <Text>
                Test
            </Text>
        </View>
    )
}