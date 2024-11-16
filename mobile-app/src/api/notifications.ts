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
  aws_appsync_graphqlEndpoint: 'https://oxi2wohj5fh35d4ifwpt7cdava.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: 'da2-smradqbjynf2dce5r4yblzds6q',
});


const subscribeChannelFunc =  async (id: string) => {
  try {
    const obj = await (API.graphql(graphqlOperation(subscribeChannel, { id })) as Observable<object>);
    console.log("subscribeChannelFunc: ", obj);
    return obj;
  } catch (error) {
    console.log("subscribeChannelFunc error: ", error);
    return null as unknown as Observable<object>;
  }

}

export default subscribeChannelFunc;
