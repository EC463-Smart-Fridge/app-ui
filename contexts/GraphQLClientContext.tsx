import React, { createContext, useContext, useReducer, ReactNode, Children } from 'react';
import { generateClient } from 'aws-amplify/api';
import awsmobile from '../src/aws-exports';
import { Amplify } from 'aws-amplify';
import { useState } from 'react';
import { ingredient, Recipe } from '../src/models';

Amplify.configure(awsmobile);

const GraphQLClientContext = createContext<any>(null); 

export const GraphQLClientProvider = ({ children }: { children: ReactNode }) => {
  const client = generateClient();

  return (
    <GraphQLClientContext.Provider value={client}>
      {children}
    </GraphQLClientContext.Provider>
  );
};

// Hook to use the GraphQL client
export const useGraphQLClient = () => useContext(GraphQLClientContext);

type userType = {
  isLoggedIn: boolean,
  userId: string,
  username: string,
  email: string,
  name: string,
  recipes: Recipe[]
}

const initState: userType = {
  isLoggedIn: false,
  userId: '',
  username: '',
  email: '',
  name: '',
  recipes: []
}




export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(initState);

  return (
    <UserContext.Provider value = {{ user, setUser}}>
      { children }
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("That ain't it, chief")
  }
  return context;
}