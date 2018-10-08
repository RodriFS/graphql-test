import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloClient } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { defaults } from './graphql/resolvers/defaults';
import { persistCache } from 'apollo-cache-persist';


import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const link = new HttpLink({ uri: 'https://api-euwest.graphcms.com/v1/cjmxcn9j10uam01g5v3u4ckp5/master' });

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: window.localStorage,
})

const defaultOptions = {
  query: {
    fetchPolicy: 'cache-first'
  }
}

export const client = new ApolloClient({
  link,
  cache,
  defaultOptions,
  clientState: {
    defaults, //The initial data you want to write to the Apollo cache when the client is initialized
  }
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
