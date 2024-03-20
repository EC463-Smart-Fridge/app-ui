import { View, Pressable, TextInput, Text } from "react-native";
import { signUp, confirmSignUp, type ConfirmSignUpInput, autoSignIn, signIn, type SignInInput, getCurrentUser, signOut } from "aws-amplify/auth";
import { useGraphQLClient } from "../contexts/GraphQLClientContext";
import { useState } from "react";

type SignUpParameters = {
    username: string;
    password: string;
    email: string;
    name: string;
}

export default function Settings() {

    const client = useGraphQLClient();
    const [user, setUser] = useState({
        isLoggedIn: false,
        userId: '',
        username: '',
        email: '',
    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [confirmationCode, setCode] = useState('');


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
            console.log(userId);
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
        }
        catch (error) {
            console.log("Error signing in", error);
        }
    }

    // Handler for signing current user out (invalidate all authentication tokens)
    const handleSignOut = async() => {
        try {
            await signOut({global: true});
        }
        catch (error) {
            console.log("Error signing user out", error);
        }
    }

    const getCurrUser = async() => {
        try {
            const { username, userId, signInDetails } = await getCurrentUser();
            setUser({
                isLoggedIn: true,
                userId: userId,
                username: '',
                email: signInDetails?.loginId || '',
            });
            console.log(`Username: ${username}`);
            console.log(`UserId: ${userId}`);
            console.log(`Details: ${signInDetails}`);
        }
        catch (error) {
            console.log("Failed to get current user:", error);
            if (user.isLoggedIn) {
                setUser({
                    isLoggedIn: false,
                    userId: '',
                    username: '',
                    email: '',
                });
            }
        }
    }
    return (
        <View>
            <Pressable onPress={() => getCurrUser()}>
                <Text>Get User</Text>
            </Pressable>
            {user.isLoggedIn? (
                <Pressable onPress={() => handleSignOut()}>
                    <Text>Sign Out</Text>
                </Pressable>
            ) : ( <>
                <TextInput
                    onChangeText={setUsername}
                    value={username ? (username) : ""}
                    inputMode="text"
                />
                <TextInput
                    onChangeText={setPassword}
                    value={password ? (password) : ""}
                    inputMode="text"
                />
                <TextInput
                    onChangeText={setName}
                    value={name ? (name) : ""}
                    inputMode="text"
                />
                <TextInput
                    onChangeText={setEmail}
                    value={email ? (email) : ""}
                    inputMode="text"
                />
                <Pressable onPress={() => handleSignUp({username, password, email, name})}>
                    <Text>Sign Up</Text>
                </Pressable>
                <TextInput
                    onChangeText={setUsername}
                    value={username ? (username) : ""}
                    inputMode="text"
                />
                <TextInput
                    onChangeText={setPassword}
                    value={password ? (password) : ""}
                    inputMode="text"
                />
                <Pressable onPress={() => handleSignIn({username, password})}>
                    <Text>Sign In</Text>
                </Pressable>
                <TextInput
                    onChangeText={setCode}
                    value={confirmationCode ? (confirmationCode) : ""}
                    inputMode="text"
                />
                <Pressable onPress={() => handleSignUpConfirmation({username, confirmationCode})}>
                    <Text>Verify Email</Text>
                </Pressable>
            </> )}
        </View>
    )
}