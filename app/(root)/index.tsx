import { View, Pressable, TextInput, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { signInWithRedirect, AuthUser, signUp, confirmSignUp, type ConfirmSignUpInput, autoSignIn, signIn, type SignInInput, getCurrentUser, signOut } from "aws-amplify/auth";
import { getFridgeUser } from "../../src/graphql/queries";
import { useGraphQLClient, useUser } from "../../contexts/GraphQLClientContext";
import React, { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import { addUser } from "../../src/graphql/mutations";
import { router } from "expo-router";

type SignUpParameters = {
    username: string;
    password: string;
    email: string;
    name: string;
}

enum modes {
  login,
  signup,
  verification,
}

enum errors {
    alreadyexists,
    incorrectlogin,
    incorrectcode,
}

export default function Auth() {
    const client = useGraphQLClient();
    const {user, setUser} = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const [mode, setMode] = useState(modes.login);
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
    
    // Handler for user sign-in
    const handleSignIn = async({username, password}: SignInInput) => {
      console.log("logging in")
        try {
            setIsLoading(true);
            const { isSignedIn, nextStep } = await signIn({username, password});
            console.log(isSignedIn);
            console.log(nextStep);
            await getCurrUser();
            router.push('/home');
            // Handle signing in the user and storing the userID
        }
        catch (error) {
            console.log("Error signing in", error);
        } finally {
          setIsLoading(false);
          
        }
    }

    const getCurrUser = async() => {
        if (!user.isLoggedIn) {
          setIsLoading(true);
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
              setIsLoading(false);
            
            }
        }
        else {
            console.log(user)
        }
    }

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
            setMode(modes.verification);
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
                            name: name
                        }
                    },
                })
                console.log('Item added successfully', addResult);
            } catch (error) {
                console.error('Error adding user', error);
            }
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
            setMode(modes.login);
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
        catch (error) {
            console.log('Error confirming sign up', error);
        }
    }

    // Handler for signing current user out (invalidate all authentication tokens)
    const handleSignOut = async() => {
        console.log("signing out")
        try {

            await signOut({global: true});
            setUser({
                isLoggedIn: false,
                userId: '',
                username: '',
                email: '',
                name: ''
            });
        }
        catch (error) {
            console.log("Error signing user out", error);
        }
    }    
    // useEffect(() => {
    //   console.log("useEffect triggered")
    //   getCurrUser()
    // }, [user])

    return (isLoading ? (
      <ActivityIndicator />
    ) : user.isLoggedIn ? (
        // ACCOUNT INFO
      <View style={styles.page}>
            <View style={styles.container}>
                <Text style={styles.title}>Account Info</Text>
                <Text style={styles.input}>Current User</Text>
                <Text style={styles.input}>Username: {user.username}</Text>
                <Text style={styles.input}>Name: {user.name}</Text>
                <Text style={styles.input}>Email: {user.email}</Text>
                <Text style={styles.input}>User ID: {user.userId}</Text>

                <Pressable 
                    onPress={() => handleSignOut()}
                    style={({pressed}) => [{backgroundColor: pressed ? 'darkturquoise' : 'paleturquoise', }, styles.submitWrapper,]}
                >
                    <Text style={styles.submit}>Sign Out</Text>
                </Pressable>
            </View>
      </View>
      ) : mode == modes.login? (
        // IF (mode == modes.login)
        <View style={styles.page}>
            <View style={styles.container}>
                <Text style={styles.title}>Fridge Buddy</Text>
                <TextInput
                    placeholder="Username"
                    placeholderTextColor="gray"
                    value={userLogin.username ? (userLogin.username) : ""}
                    onChangeText={text => setUserLogin({username:text, password:userLogin.password})}
                    style={styles.input}
                />
                <TextInput
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor="gray"
                    value={userLogin.password ? (userLogin.password) : ""}
                    onChangeText={text => setUserLogin({username:userLogin.username, password:text})}
                    style={styles.input}
                />

                <Pressable 
                    style={({pressed}) => [{backgroundColor: pressed ? 'darkturquoise' : 'paleturquoise', }, styles.submitWrapper,]} 
                    onPress={() => handleSignIn({username: userLogin.username, password: userLogin.password})}
                >
                    <Text style={styles.submit}>Login</Text>
                </Pressable>

                <View style={{flexGrow: 1}}></View>

                <View style={styles.switchWrapper}>
                    <Text>Don't have an account?</Text>
                    <Pressable onPress={() => setMode(modes.signup)}>
                        <Text style={styles.switchLink}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    ) : mode == modes.signup ? (
        // ELSE (mode == modes.signup)
        <View style={styles.page}>
            <View style={styles.container}>
            <Text style={styles.title}>Fridge Buddy</Text>
            <TextInput
                placeholder="Email"
                placeholderTextColor="gray"
                value={userSignup.email ? (userSignup.email) : ""}
                onChangeText={text => setUserSignup({email:text, name:userSignup.name, username:userSignup.username, password:userSignup.password})}
                style={styles.input}
            />
        
            <TextInput
                placeholder="Name"
                placeholderTextColor="gray"
                value={userSignup.name ? (userSignup.name) : ""}
                onChangeText={text => setUserSignup({email:userSignup.email, name:text, username:userSignup.username, password:userSignup.password})}
                style={styles.input}
            />

            <TextInput
                placeholder="Username"
                placeholderTextColor="gray"
                value={userSignup.username ? (userSignup.username) : ""}
                onChangeText={text => setUserSignup({email:userSignup.email, name:userSignup.name, username:text, password:userSignup.password})}
                style={styles.input}
            />
        
            <TextInput
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="gray"
                value={userSignup.password ? (userSignup.password) : ""}
                onChangeText={text => setUserSignup({email:userSignup.email, name:userSignup.name, username:userSignup.username, password:text})}
                style={styles.input}
            />

            <Pressable 
                onPress={() => handleSignUp({email:userSignup.email, name:userSignup.name, username: userSignup.username, password: userSignup.password})}
                style={({pressed}) => [{backgroundColor: pressed ? 'darkturquoise' : 'paleturquoise', }, styles.submitWrapper,]}
            >
                <Text style={styles.submit}>Sign Up</Text>
            </Pressable>
          <View style={styles.switchWrapper}>
                <Text>Already have an account?</Text>
                <Pressable onPress={() => setMode(modes.login)}>
                    <Text style={styles.switchLink}>Login</Text>
                </Pressable>
            </View>
        </View>
        </View>
      ): (
        <View style={styles.page}>
            <View style={styles.container}>
                <Text style={styles.title}>Fridge Buddy</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Verification Code"
                    placeholderTextColor="gray"
                    value={verificationCode ? (verificationCode) : ""}
                    onChangeText={text => setCode(text)}
                />
                <View style={styles.verifyWrapper}>
                    <Pressable 
                        onPress={() => setMode(modes.signup)}
                        style={({pressed}) => [{backgroundColor: pressed ? 'gray' : 'lightgray', flexGrow: 1,}, styles.submitWrapper,]}
                    >
                        <Text style={styles.submit}>Cancel</Text>
                    </Pressable>
                    <Pressable 
                        onPress={() => handleSignUpConfirmation({username: userSignup.username, confirmationCode: verificationCode})}
                        style={({pressed}) => [{backgroundColor: pressed ? 'darkturquoise' : 'paleturquoise', flexGrow: 1,}, styles.submitWrapper,]}
                    >
                        <Text style={styles.submit}>Confirm</Text>
                    </Pressable>
                </View>
            </View>
        </View>
      )
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'paleturquoise',
        marginBottom: 10,
        fontFamily: 'sans-serif',
    },
    container: {
        padding: 40,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'lightgray',
        width: '80%',
        height: 500,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        rowGap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'whitesmoke',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: "gray",
    },
    submitWrapper: {
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submit: {
        color: 'white',
    },
    verifyWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 20,
        width: '100%',
    },
    confirm: {

    },
    cancel: {

    },
    switchWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 4,
    },
    switchLink: {
        color: 'darkturquoise',
    }
})