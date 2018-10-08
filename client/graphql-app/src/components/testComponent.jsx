import React from 'react';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const GET_USER = gql`
      {
        userSchemas {
          name
          lastname
        }
      }
    `;

const POST_USER = gql`
      mutation PostUser ($name: String!, $lastname: String!) {
        createUserSchema (data: {name: $name, lastname: $lastname}) {
          name
          lastname
        }
      }
      `;



export default class TestComponent extends React.Component {


  state = {
    name: 'John',
    lastname: 'Q',
  }

  render() {
    const { name, lastname } = this.state
    return (
      <div>
        <Query query={GET_USER}>
          {({loading, error, data, client}) => {
              if (loading) return <p>Loading...</p>;
              if (error) {
                try {
                  console.log('Network down!');
                  data = client.readQuery({ query: GET_USER })
                } catch (err) {
                  return <p>Error :(</p>;
                }
              }
              return <p>{data.userSchemas[0].name} {data.userSchemas[0].lastname}</p>
          }}
        </Query>

        <Mutation mutation={POST_USER}
          variables={{ name, lastname }}>
            {(PostUser, {loading, error, data, client}) => {
              if (loading) return <p>Loading...</p>;
              if (error) {
                try {
                  console.log('Network down!');
                  data = client.readQuery({ query: GET_USER })
                  data = client.writeQuery({
                    query: GET_USER,
                    data: {userSchemas: [...data.userSchemas, {__typename: 'userSchema' , name, lastname}]} });
                } catch (err) {
                  return <p>Error :(</p>;
                }
              }
              return <button onClick={e => {
                  e.preventDefault();
                  PostUser({variables: { name, lastname }});
                }}>
                Submit
              </button>
            }}
        </Mutation>
      </div>

    )
  }
}
