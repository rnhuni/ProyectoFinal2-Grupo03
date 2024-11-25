// sonar.ignore
/* istanbul ignore file */
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { Observable } from "zen-observable-ts";

const subscribeNotifications = /* GraphQL */ `
  subscription Subscribe($id: String!) {
    subscribe(id: $id) {
      data
    }
  }
`;

const publishNotification = /* GraphQL */ `
  mutation Publish($id: String!, $data: AWSJSON!) {
    publish(id: $id, data: $data) {
      id
      data
    }
  }
`;

const awsConfig = {
  aws_appsync_graphqlEndpoint:
    "https://oxi2wohj5fh35d4ifwpt7cdava.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-smradqbjynf2dce5r4yblzds6q",
};

Amplify.configure(awsConfig);

export const subscribeNotificationsFunc = async (
  id: string
): Promise<Observable<object> | null> => {
  try {
    const observable = (API.graphql(
      graphqlOperation(subscribeNotifications, { id })
    ) as unknown) as Observable<object>;
    return observable;
  } catch (error) {
    console.error("Error en subscribeNotificationsFunc: ", error);
    return null;
  }
};

export const publishNotificationFunc = async (id: string, data: object) => {
  try {
    const result = await API.graphql(
      graphqlOperation(publishNotification, { id, data })
    );
    return result;
  } catch (error) {
    console.error("Error en publishNotificationFunc: ", error);
    return null;
  }
};
