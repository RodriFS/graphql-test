import React from 'react';
import { Query } from "react-apollo";
import { graphql } from 'react-apollo';
import { GET_USER } from '../graphql/queries';
import { POST_USER } from '../graphql/mutations';
const uuid = require('uuid/v4');


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
            if (loading) return <p>Loading...</p>
            if (error) {
              return <p>'Error :('</p>;
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
