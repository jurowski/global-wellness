import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import React from 'react';

interface ApolloTestProviderProps {
  children: React.ReactNode;
  mocks?: MockedResponse[];
  addTypename?: boolean;
}

export function ApolloTestProvider({ children, mocks = [], addTypename = false }: ApolloTestProviderProps) {
  if (mocks.length > 0) {
    return (
      <MockedProvider mocks={mocks} addTypename={addTypename}>
        {children}
      </MockedProvider>
    );
  }

  // If no mocks provided, use a real Apollo Client with an in-memory cache
  const client = new ApolloClient({
    uri: 'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
} 