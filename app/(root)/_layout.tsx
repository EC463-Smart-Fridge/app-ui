import { Tabs, Stack} from "expo-router";
import { ActivityIndicator } from "react-native";
import { useUser, useGraphQLClient} from "../../contexts/GraphQLClientContext";
import { getCurrentUser, } from "aws-amplify/auth";
import { getFridgeUser } from "../../src/graphql/queries";
import HomeIcon from "../../assets/icons/HomeIcon";
import RecipeIcon from "../../assets/icons/RecipeIcon";
import ScanIcon from "../../assets/icons/ScanIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";
import { useEffect, useState } from "react";

export default function Layout() {
    const { user, setUser } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const client = useGraphQLClient();

    const getCurrUser = async() => {
        if (!user.isLoggedIn) {
            try {
                const { username, userId, signInDetails } = await getCurrentUser();
                try {
                    const result = await client.graphql({
                        query: getFridgeUser,
                        variables: {
                            pk:userId,
                        }
                    })
                    if (result.data) {
                        setUser({
                            isLoggedIn: true,
                            userId: userId,
                            username: result.data.getFridgeUser.username,
                            email: result.data.getFridgeUser.email,
                            name: result.data.getFridgeUser.name2
                        })
                    }
                    else {
                        console.log('ERROR: User does not exist');
                    }
                } catch (error) {
                    console.log('error on fetching user', error);
                } 
                console.log(`Details: ${signInDetails}`);
                console.log(user)
            }
            catch (error) {
                console.log("Failed to get current user:", error);
                if (user.isLoggedIn) {
                    setUser({
                        isLoggedIn: false,
                        userId: '',
                        username: '',
                        email: '',
                        name: ''
                    })
                }
            } finally {
            
            }
        }
        else {
            console.log(user)
        }
    }

    useEffect(() => {
        const update = async() => {
            setIsLoading(true);
            console.log("useEffect")
            await getCurrUser();
            console.log(user)
            setIsLoading(false);
        }

        update();
    }, [])

    return (isLoading? 
        <ActivityIndicator size="large" color="darkturquoise" />
        : !user.isLoggedIn ?
        <Stack 
            screenOptions={{
                headerShown: false,
            }}
        >
        </Stack>
        :
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
                    name="index"    
                    options={{ href: null, headerShown: false}}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="home"
                    options={{ tabBarLabel: "Home", tabBarIcon: ({focused}) => <HomeIcon fill={focused ? 'darkturquoise' : 'darkgray'} />}}
                />
                <Tabs.Screen
                    name="scanner"
                    options={{ tabBarLabel: "Scan", tabBarIcon: ({focused}) => <ScanIcon fill={focused ? 'darkturquoise' : 'darkgray'}/>}}
                />
                <Tabs.Screen
                    name="recipes"
                    options={{ tabBarLabel: "Recipes", tabBarIcon: ({focused}) => <RecipeIcon fill={focused ? 'darkturquoise' : 'darkgray'}/>}}
                />
                <Tabs.Screen
                    name="settings"
                    options={{ tabBarLabel: "Settings", tabBarIcon: ({focused}) => <SettingsIcon fill={focused ? 'darkturquoise' : 'darkgray'}/>}}
                />
            </Tabs>
        </> 
    )
}