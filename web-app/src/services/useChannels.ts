// sonar.ignore
/* istanbul ignore file */
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { Observable } from "zen-observable-ts";

const subscribeChannel = /* GraphQL */ `
  subscription SubscribeChannel($id: String!) {
    subscribe(id: $id) {
      data
    }
  }
`;

const publishChannel = /* GraphQL */ `
  mutation PublishData($data: AWSJSON!, $id: String!) {
    publish(data: $data, id: $id) {
      data
      id
    }
  }
`;

const awsConfig = {
  aws_appsync_graphqlEndpoint:
    "https://oxi2wohj5fh35d4ifwpt7cdava.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "API_KEY", // Ensure this matches your AppSync setup
  aws_appsync_apiKey: "da2-smradqbjynf2dce5r4yblzds6q",
};
Amplify.configure(awsConfig);
// Amplify configuration utilizando variables de entorno

export const subscribeChannelFunc = async (
  id: string
): Promise<Observable<object> | null> => {
  try {
    console.log("Amplify configured", awsConfig);
    const obj = await (API.graphql(
      graphqlOperation(subscribeChannel, { id })
    ) as Observable<object>);
    return obj;
  } catch (error) {
    console.error("subscribeChannelFunc error: ", error);
    return null;
  }
};

export const publishChannelFunc = async (data: string, id: string) => {
  try {
    // console.log("2. publishChannelFunc: ", data, id);
    const obj = await API.graphql(
      graphqlOperation(publishChannel, { data, id })
    );
    // console.log("3. publishChannelFunc: ", obj);
    return obj;
  } catch (error) {
    console.error(error);
    // console.log("4. subscribeChannelFunc error: ", error);
    return null as unknown as Observable<object>;
  }
};
