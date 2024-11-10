import { Amplify } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { Observable } from 'zen-observable-ts';


export const subscribeChannel = /* GraphQL */ `
  subscription SubscribeChannel($id: String!) {
    subscribe(id: $id) {
      data
    }
  }
`

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: 'https://oxi2wohj5fh35d4ifwpt7cdava.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'apiKey',
      apiKey: 'da2-smradqbjynf2dce5r4yblzds6q'
    },
  },
});


const subscribeChannelFunc = (id: string) => {
  try {
    const obj = (API.graphql(graphqlOperation(subscribeChannel, { id: String })) as Observable<object>);
    console.log("subscribeChannelFunc: ", obj);
    return obj;
  } catch (error) {
    console.log("subscribeChannelFunc error: ", error);
    return null as unknown as Observable<object>;
  }

}

export default subscribeChannelFunc;
