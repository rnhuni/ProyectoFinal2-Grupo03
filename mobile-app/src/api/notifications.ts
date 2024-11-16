import { Amplify } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { Observable } from 'zen-observable-ts';
import Config from 'react-native-config';


export const subscribeChannel = /* GraphQL */ `
  subscription SubscribeChannel($id: String!) {
    subscribe(id: $id) {
      data
    }
  }
`
const awsConfig = {
  aws_appsync_graphqlEndpoint: Config.AWS_APPSYNC_GRAPHQLENDPOINT,
  aws_appsync_region: Config.AWS_APPSYNC_REGION,
  aws_appsync_authenticationType: Config.AWS_APPSYNC_AUTHENTICATIONTYPE,
  aws_appsync_apiKey: Config.AWS_APPSYNC_APIKEY,
};

Amplify.configure(awsConfig);

const subscribeChannelFunc = async (id: string) => {

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
