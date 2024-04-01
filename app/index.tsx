import { View, Pressable, TextInput, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { signInWithRedirect, AuthUser, signUp, confirmSignUp, type ConfirmSignUpInput, autoSignIn, signIn, type SignInInput, getCurrentUser, signOut } from "aws-amplify/auth";
import { useGraphQLClient } from "../contexts/GraphQLClientContext";
import React, { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import { addUser } from "../src/graphql/mutations";
import { getFridgeUser } from "../src/graphql/queries";
import { useUser } from "../contexts/GraphQLClientContext";
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
  verification
}

export default function Login() {
    const client = useGraphQLClient();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useUser();

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
            router.replace('/home');
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
            // getCurrUser();
        }
        catch (error) {
            console.log("Error signing user out", error);
        }
    }    
    useEffect(() => {
      console.log("useEffect triggered")
      getCurrUser()
    }, [])

    return (isLoading ? (
      <ActivityIndicator />
    ) : user.isLoggedIn ? (
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
      ) : mode == modes.login? (
        <>
            <View>
                <TextInput
                
                    placeholder="Username"
                    placeholderTextColor="gray"
                    value={userLogin.username ? (userLogin.username) : ""}
                    onChangeText={text => setUserLogin({username:text, password:userLogin.password})}
                  />
            </View>
            <View>
                <TextInput
                
                    placeholder="Password"
                    placeholderTextColor="gray"
                    value={userLogin.password ? (userLogin.password) : ""}
                    onChangeText={text => setUserLogin({username:userLogin.username, password:text})}
                  />
            </View>

            <Pressable onPress={() => handleSignIn({username: userLogin.username, password: userLogin.password})}>
                <Text>Login</Text>
            </Pressable>
            {/* <Pressable onPress={() => switchSignUp()}>
                <Text>Sign Up</Text>
            </Pressable> */}

        </>
    ) : (
      <>
          <View>
              <TextInput
              
                  placeholder="Email"
                  placeholderTextColor="gray"
                  value={userSignup.email ? (userSignup.email) : ""}
                  onChangeText={text => setUserSignup({email:text, name:userSignup.name, username:userSignup.username, password:userSignup.password})}
              />
          </View>
          <View>
              <TextInput
              
                  placeholder="Name"
                  placeholderTextColor="gray"
                  value={userSignup.name ? (userSignup.name) : ""}
                  onChangeText={text => setUserSignup({email:userSignup.email, name:text, username:userSignup.username, password:userSignup.password})}
              />
          </View>
          <View>
              <TextInput
              
                  placeholder="Username"
                  placeholderTextColor="gray"
                  value={userSignup.username ? (userSignup.username) : ""}
                  onChangeText={text => setUserSignup({email:userSignup.email, name:userSignup.name, username:text, password:userSignup.password})}
              />
          </View>
          <View>
              <TextInput
              
                  placeholder="Password"
                  placeholderTextColor="gray"
                  value={userSignup.password ? (userSignup.password) : ""}
                  onChangeText={text => setUserSignup({email:userSignup.email, name:userSignup.name, username:userSignup.username, password:text})}
              />
          </View>

          {/* <Pressable onPress={() => handleSignUp({email:userSignup.email, name:userSignup.name, username: userSignup.username, password: userSignup.password})}>
              <Text>Sign Up</Text>
          </Pressable> */}
          {/* <Pressable onPress={() => switchLogin()}>
              <Text>Login</Text>
          </Pressable> */}
      </>
      )
    )
}

const styles = StyleSheet.create({

})