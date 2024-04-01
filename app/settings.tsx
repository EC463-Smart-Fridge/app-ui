import { View, Pressable, TextInput, Text, StyleSheet, Modal } from "react-native";
import { signInWithRedirect, AuthUser, signUp, confirmSignUp, type ConfirmSignUpInput, autoSignIn, signIn, type SignInInput, getCurrentUser, signOut } from "aws-amplify/auth";
import { useGraphQLClient } from "../contexts/GraphQLClientContext";
import React, { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import { addUser } from "../src/graphql/mutations";
import { getFridgeUser } from "../src/graphql/queries";
import { useUser } from "../contexts/GraphQLClientContext";

type SignUpParameters = {
    username: string;
    password: string;
    email: string;
    name: string;
}

export default function Settings() {
    const client = useGraphQLClient();
    const [user, setUser] = useUser();

    const [mode, setMode] = useState('login');
    const [userLogin, setUserLogin] = useState({
        username: '',
        password: ''
    })
    const [userSignup, setUserSignup] = useState({
        email: '',
        name: '',
        username: '',
        password: '',
    });
    const [verificationCode, setCode] = useState('');
    
    // Handler for signing up users
    const handleSignUp = async({username, password, email, name}: SignUpParameters) => {
        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email,
                        name
                    },
                    autoSignIn: true
                }
            });
            setMode('verification');
            console.log(nextStep);
            
            // Handle creating a user in GraphQL here
            try {
                // Run deleteItem GraphQL mutation
                const addResult = await client.graphql({
                    query: addUser,
                    variables: {
                        input: {
                            pk: userId,
                            username: username,
                            email: email,
                            name2: name
                        }
                    },
                })
                console.log('Item added successfully', addResult);
            } catch (error) {
                console.error('Error adding item', error);
            }
            
            // Handle signing in the user
            handleSignIn({username, password});
        }
        catch (error) {
            console.log("Error Signing up:", error);
        }
    };

    // Function for handling user confirmation after signing up
    const handleSignUpConfirmation = async({username, confirmationCode}: ConfirmSignUpInput) => {
        try {
            const { isSignUpComplete, nextStep } = await confirmSignUp({username, confirmationCode});
            console.log(isSignUpComplete);
            console.log(nextStep);
            switchLogin();
        }
        catch (error) {
            console.log('Error confirming sign up', error);
        }
    }

    // Handler for auto-signing in a user after cases like user confirmation
    const handleAutoSignIn = async() => {
        try {
            const result = await autoSignIn();
        }
        catch (error) {
            console.log(error);
        }
    }

    // Handler for user sign-in
    const handleSignIn = async({username, password}: SignInInput) => {
        try {
            const { isSignedIn, nextStep } = await signIn({username, password});
            console.log(isSignedIn);
            console.log(nextStep);
            // Handle signing in the user and storing the userID
        }
        catch (error) {
            console.log("Error signing in", error);
        }
        getCurrUser();
    }

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
            }
        }
        else {
            console.log(user)
        }
    }

    // Handler for signing current user out (invalidate all authentication tokens)
    const handleSignOut = async() => {
        try {
            await signOut({global: true});
            setUser({
                isLoggedIn: false,
                userId: '',
                username: '',
                email: '',
                name: ''
            })
        }
        catch (error) {
            console.log("Error signing user out", error);
        }
    }

    // Implement handler for getting signIn with Redirect 
    // Hub.listen("auth", async({ payload }) => {
    //     switch (payload.event) {
    //       case "signInWithRedirect":
    //         const user = await getCurrentUser();
    //         console.log(user.username);
    //         break;
    //       case "signInWithRedirect_failure":
    //         // handle sign in failure
    //         break;
    //       case "customOAuthState":
    //         const state = payload.data; // this will be customState provided on signInWithRedirect function
    //         console.log(state);
    //         break;
    //     }
    // });

    const switchSignUp = () => {
        setMode('signup');
        setUserLogin({
            username: '',
            password: ''
        });
        setUserSignup({
            email: '',
            name: '',
            username: '',
            password: '',
        });
    }

    const switchLogin = () => {
        setMode('login');
        setUserLogin({
            username: '',
            password: ''
        });
        setUserSignup({
            email: '',
            name: '',
            username: '',
            password: '',
        });
    }
    
    useEffect(() => {
        getCurrUser();
    }, [user])

    return (
        <View>
            {user.isLoggedIn? (
                <>
                    <Text>Current User</Text>
                    <Text>Username: {user.username}</Text>
                    <Text>Name: {user.name}</Text>
                    <Text>Email: {user.email}</Text>
                    <Text>User ID: {user.userId}</Text>

                    <Pressable onPress={() => handleSignOut()}>
                        <Text>Sign Out</Text>
                    </Pressable>
                </>
            ) : ( 
                <View>
                {mode == 'login'? (
                    <View>
                        <View>
                            <TextInput
                            
                                placeholder="Username"
                                placeholderTextColor="gray"
                                value={userLogin.username ? (userLogin.username) : ""}
                                onChangeText={text => setUserLogin({username:text, password:userLogin.password})}/>
                        </View>
                        <View>
                            <TextInput
                            
                                placeholder="Password"
                                placeholderTextColor="gray"
                                value={userLogin.password ? (userLogin.password) : ""}
                                onChangeText={text => setUserLogin({username:userLogin.username, password:text})}/>
                        </View>

                        <Pressable onPress={() => handleSignIn({username: userLogin.username, password: userLogin.password})}>
                            <Text>Login</Text>
                        </Pressable>
                        <Pressable onPress={() => switchSignUp()}>
                            <Text>Sign Up</Text>
                        </Pressable>

                    </View>
                ): (
                    <View>
                        {mode == 'signup'? (<View>
                            <View>
                                <TextInput
                                
                                    placeholder="Email"
                                    placeholderTextColor="gray"
                                    value={userSignup.email ? (userSignup.email) : ""}
                                    onChangeText={text => setUserSignup({email:text, name:userSignup.name, username:userSignup.username, password:userSignup.password})}/>
                            </View>
                            <View>
                                <TextInput
                                
                                    placeholder="Name"
                                    placeholderTextColor="gray"
                                    value={userSignup.name ? (userSignup.name) : ""}
                                    onChangeText={text => setUserSignup({email:userSignup.email, name:text, username:userSignup.username, password:userSignup.password})}/>
                            </View>
                            <View>
                                <TextInput
                                
                                    placeholder="Username"
                                    placeholderTextColor="gray"
                                    value={userSignup.username ? (userSignup.username) : ""}
                                    onChangeText={text => setUserSignup({email:userSignup.email, name:userSignup.name, username:text, password:userSignup.password})}/>
                            </View>
                            <View>
                                <TextInput
                                
                                    placeholder="Password"
                                    placeholderTextColor="gray"
                                    value={userSignup.password ? (userSignup.password) : ""}
                                    onChangeText={text => setUserSignup({email:userSignup.email, name:userSignup.name, username:userSignup.username, password:text})}/>
                            </View>

                            <Pressable onPress={() => handleSignUp({email:userSignup.email, name:userSignup.name, username: userSignup.username, password: userSignup.password})}>
                                <Text>Sign Up</Text>
                            </Pressable>
                            <Pressable onPress={() => switchLogin()}>
                                <Text>Login</Text>
                            </Pressable>
                    </View>
                    ) : (
                        <View>
                            <View>
                                <TextInput
                                
                                    keyboardType="numeric"
                                    placeholder="Verification Code: ######"
                                    placeholderTextColor="gray"
                                    value={verificationCode ? (verificationCode) : ""}
                                    onChangeText={text => setCode(text)}/>
                            </View>

                            <Pressable onPress={() => handleSignUpConfirmation({username: userSignup.username, confirmationCode: verificationCode})}>
                                <Text>Verify</Text>
                            </Pressable>
                            <Pressable onPress={() => switchSignUp()}>
                                <Text>Cancel</Text>
                            </Pressable>
                        </View>
                    )}
                    </View>
                    
                )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({

})