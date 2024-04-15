import { Link, Redirect, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { usePathname } from 'expo-router';
import { useUser} from "../../../contexts/GraphQLClientContext";

export default function Layout() {
    let path = usePathname();
    // console.log(path)
    const { user, setUser } = useUser();
    return (user.isLoggedIn ?
        <>
            <View style={styles.nav}>
                <Link 
                    href="/scanner/smartscan" 
                    style={{...styles.link, 
                        backgroundColor: (path==="/scanner/smartscan" || path==="/scanner") ? "darkturquoise" : "white" ,
                        color: (path==="/scanner/smartscan" || path==="/scanner") ? "white" : "gray",
                    }}
                >
                    Smart Scanner
                </Link>
                <Link 
                    href="/scanner/barcode" 
                    style={{...styles.link,
                        backgroundColor: path==="/scanner/barcode" ? "darkturquoise" : "white",
                        color: path==="/scanner/barcode" ? "white" : "gray",
                    }}
                >
                    Barcode Scanner
                </Link>
            </View>
            <Stack
                screenOptions={
                    {
                        headerShown: false,
                    }
                }
            >
                <Stack.Screen name="smartscan"></Stack.Screen>
                <Stack.Screen name="barcode"></Stack.Screen>
            </Stack>
        </> :
        <Redirect href="/" />
    )
}

const styles = StyleSheet.create({
    nav: {
        // display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        position: "absolute",
        width: "100%",
        top: 0,
        zIndex: 100,
    },
    link: {
        padding: 8,
        margin: 12,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});