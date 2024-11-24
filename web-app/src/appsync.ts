import { Amplify, API, graphqlOperation } from "aws-amplify";
import { Observable } from "zen-observable-ts";

// Suscripción para recibir notificaciones
const subscribeNotifications = /* GraphQL */ `
  subscription Subscribe($id: String!) {
    subscribe(id: $id) {
      data
    }
  }
`;

// Publicación de notificaciones (si necesitas enviar notificaciones desde el frontend)
const publishNotification = /* GraphQL */ `
  mutation Publish($id: String!, $data: AWSJSON!) {
    publish(id: $id, data: $data) {
      id
      data
    }
  }
`;

// Configuración de Amplify
const awsConfig = {
  aws_appsync_graphqlEndpoint:
    "https://oxi2wohj5fh35d4ifwpt7cdava.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-smradqbjynf2dce5r4yblzds6q",
};

Amplify.configure(awsConfig);

/**
 * Función para suscribirse a notificaciones
 * @param id - ID del canal de suscripción
 * @returns Observable para manejar las suscripciones
 */
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

/**
 * Función para publicar una notificación (opcional)
 * @param id - ID del canal al que enviar la notificación
 * @param data - Datos de la notificación
 * @returns Resultado de la mutación
 */
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
