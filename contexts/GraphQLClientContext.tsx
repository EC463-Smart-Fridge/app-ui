import React, { createContext, useContext, ReactNode } from 'react';
import { generateClient } from 'aws-amplify/api';
import awsmobile from '../src/aws-exports';
import { Amplify } from 'aws-amplify';

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