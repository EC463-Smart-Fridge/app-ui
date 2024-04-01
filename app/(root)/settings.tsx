import { View, Pressable, TextInput, Text, StyleSheet, Modal } from "react-native";
import { signInWithRedirect, AuthUser, signUp, confirmSignUp, type ConfirmSignUpInput, autoSignIn, signIn, type SignInInput, getCurrentUser, signOut } from "aws-amplify/auth";
import { useGraphQLClient } from "../../contexts/GraphQLClientContext";
import React, { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import { addUser } from "../../src/graphql/mutations";
import { getFridgeUser } from "../../src/graphql/queries";
import { useUser } from "../../contexts/GraphQLClientContext";
import { Redirect } from "expo-router";

type SignUpParameters = {
    username: string;
    password: string;
    email: string;
    name: string;
}



export default function Settings() {
    const {user, setUser} = useUser();
    return (
        user.isLoggedIn ? (
            <View>
                <Text>Settings</Text>
            </View>
        ) : (
            <Redirect href="/" />
        )
    )
}

const styles = StyleSheet.create({

})