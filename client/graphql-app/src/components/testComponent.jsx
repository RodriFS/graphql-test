import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GET_USER = gql`
      {
        userSchemas {
          name
          lastname
        }
      }
    `;



const getUser = () => (
  <Query query={GET_USER}>
    {({loading, error, data, client}) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        console.log(client)
        return <p>{data.userSchemas[0].name} {data.userSchemas[0].lastname}</p>
    }}
  </Query>
);

export default class TestComponent extends React.Component {

  componentDidMount() {
    // console.log(getUser())
    // client.writeQuery()
  }

  render() {
    return <h1>{getUser()}</h1>
  }
}
