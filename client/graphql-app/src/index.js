import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloClient } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { initialState } from './graphql/resolvers/defaults';
import { persistCache } from 'apollo-cache-persist';
import { ApolloLink } from 'apollo-link';
import { RetryLink } from "apollo-link-retry";
import { withClientState } from 'apollo-link-state';



import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  // defaults: initialState,
})

const link = ApolloLink.from([
  new RetryLink({
    delay: (count, operation, error) => {
      return count*count * 1000;
    },
    attempts: (count, operation, error) => {
      return !!error
    },
  }),
  stateLink,
  new HttpLink({ uri: 'https://api-euwest.graphcms.com/v1/cjmxcn9j10uam01g5v3u4ckp5/master' })
])

persistCache({
  cache,
  storage: window.localStorage,
})

const defaultOptions = {
  query: {
    fetchPolicy: 'cache-and-network'
  }
}

export const client = new ApolloClient({
  link,
  cache,
  defaultOptions,
})



ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
