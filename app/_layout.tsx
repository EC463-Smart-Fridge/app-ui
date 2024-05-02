import { Stack } from "expo-router";
import { View } from "react-native";
import { GraphQLClientProvider} from "../contexts/GraphQLClientContext";
import { UserProvider } from "../contexts/UserContext";
import { RefreshProvider } from "../contexts/RefreshContext";

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
                <RefreshProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        <Stack.Screen
                            name="(root)"
                        ></Stack.Screen>
                    </Stack>
                </RefreshProvider>
            </UserProvider>
        </GraphQLClientProvider>
        </>
    )
}