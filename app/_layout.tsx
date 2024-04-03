import { Stack } from "expo-router";
import { View } from "react-native";
import { GraphQLClientProvider, UserProvider} from "../contexts/GraphQLClientContext";

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
        </GraphQLClientProvider>
        </>
    )
}