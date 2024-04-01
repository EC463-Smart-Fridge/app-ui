import { Stack } from "expo-router";
import { View } from "react-native";
import { GraphQLClientProvider, UserProvider} from "../contexts/GraphQLClientContext";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import HomeIcon from "../assets/icons/HomeIcon";
// import CakeIcon from "../assets/icons/CakeIcon";
import RecipeIcon from "../assets/icons/RecipeIcon";
import ScanIcon from "../assets/icons/ScanIcon";
import SettingsIcon from "../assets/icons/SettingsIcon";

const initState = {
    isLoggedIn: false,
    userId: '',
    username: '',
    email: '',
    name: ''
  }

export default function Layout() {
    return (
        <>
        {/* NATIVE TOP BAR */}
        {/* <StatusBar style="light" /> */}

        {/* TEMP TABLET TOP BAR */}
        <View style={{height: 24, width: "100%", backgroundColor: 'white'}}></View>

        {/* TEMP MOBILE TOP BAR */}
        <GraphQLClientProvider>
            <UserProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen
                        name="(root)"
                    ></Stack.Screen>
                </Stack>
            </UserProvider>
            {/* </View> */}
        </GraphQLClientProvider>
        </>
    )
}