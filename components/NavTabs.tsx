import {  Pressable, View, Text } from "react-native"
import { Link } from "expo-router"

const NavTabs = () => {
    return (
        <View>
            <Link href="/home" >
                <Pressable>
                    <Text>Home</Text>
                </Pressable>
            </Link>
            <Link href="/scan" >
                <Pressable>
                    <Text>Scan</Text>
                </Pressable>
            </Link>
            <Link href="/recipes" >
                <Pressable>
                    <Text>Recipes</Text>
                </Pressable>
            </Link>
        </View>
    )
}