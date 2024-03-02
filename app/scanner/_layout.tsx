import { Link, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { usePathname } from 'expo-router';

export default function Layout() {
    let path = usePathname();
    // console.log(path)
    return (
        <>
            <View style={styles.nav}>
                <Link href="scanner/barcode" style={[styles.link, path==="/scanner/barcode" && styles.active]}>Barcode Scanner</Link>
                <Link href="scanner/smartscan" style={[styles.link, path==="/scanner/smartscan" && styles.active]}>Smart Scanner</Link>
            </View>
            <Stack
                screenOptions={
                    {
                        headerShown: false,
                    }
                }
            />
        </>
    )
}

const styles = StyleSheet.create({
    nav: {
        // display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    link: {
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    active: {
        backgroundColor: "darkturquoise",
    }
});