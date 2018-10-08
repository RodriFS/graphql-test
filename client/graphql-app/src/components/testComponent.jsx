import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { graphql } from 'react-apollo';
const uuid = require('uuid/v4');

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



class TestComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: 'Robert',
      lastname: 'P',
    }
  }

  handleSubmit = (event) => {
    this.props.add(this.state.name, this.state.lastname);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <Query query={GET_USER}>
          {({loading, error, data, client}) => {
            if (loading) return <p>Loading...</p>;
              if (error) {
                try {
                  console.log('Network down!');
                  data = client.readQuery({ query: GET_USER }, true)
                  console.log(client)
                } catch (err) {
                  return <p>'Error :('</p>;
                  }
                }
                return data.userSchemas.map(item => {
                  return <p key={item.name}>{item.name} {item.lastname}</p>
                })
              }}
            </Query>
          <button onClick={this.handleSubmit}>Submit</button>
      </div>
    )
  }
}


const postUser = graphql(POST_USER, {
  options: { errorPolicy: 'all' },
  props: ({ mutate } ) => ({
    add: (name, lastname) => mutate ({
      variables: {name, lastname},
      optimisticResponse: {
        __typename: 'Mutation',
        createUserSchema: {
          name,
          lastname,
          __typename: 'userSchema',
          id: uuid(),
        }
      },
      update: (store, { data: { createUserSchema }}) => {
        const data = store.readQuery({ query: GET_USER });
        data.userSchemas.push(createUserSchema);
        store.writeQuery({query: GET_USER, data})
      }
    })
  })
})(TestComponent)

export default postUser;
