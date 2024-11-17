import { Amplify } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { Observable } from 'zen-observable-ts';
import Config from 'react-native-config';


const subscribeChannel = /* GraphQL */ `
  subscription SubscribeChannel($id: String!) {
    subscribe(id: $id) {
      data
    }
  }
`


const publishChannel = /* GraphQL */ `
  mutation PublishData($data: AWSJSON!, $id: String!, ) {
    publish(data: $data, id: $id) {
      data
      id
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

export const subscribeChannelFunc = async (id: string) => {

  try {
    const obj = await (API.graphql(graphqlOperation(subscribeChannel, { id })) as Observable<object>);
    // console.log("subscribeChannelFunc: ", obj);
    return obj;
  } catch (error) {
    // console.log("subscribeChannelFunc error: ", error);
    return null as unknown as Observable<object>;
  }

}

export const publishChannelFunc = async (data: string, id: string) => {

  try {
    // console.log("2. publishChannelFunc: ", data, id);
    const obj = await API.graphql(graphqlOperation(publishChannel, { data, id }));
    // console.log("3. publishChannelFunc: ", obj);
    return obj;
  } catch (error) {
    // console.log("4. subscribeChannelFunc error: ", error);
    return null as unknown as Observable<object>;
  }

}




