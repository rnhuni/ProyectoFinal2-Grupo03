// sonar.ignore
/* istanbul ignore file */
import { useEffect, useState } from "react";
import { subscribeChannelFunc } from "../../services/useChannels";

const useSuscribeGraphql = (id: string) => {
  const [notifications] = useState<string[]>([]);
  const [data] = useState("");
  const [received, setReceived] = useState("");
  console.log("1 useNotifications: ", id);

  /** LLAMADO A GRAPHQL para lectura del chat */
  useEffect(() => {
    console.log("2 useEffect: ", id);
    const subscribeToChannel = async (id: string) => {
      const subscription = (await subscribeChannelFunc(id))?.subscribe({
        next: ({
          value,
        }: {
          value: { data: { subscribe: { data: string } } };
        }) => {
          console.log("3 value next: ", value);
          setReceived(value.data.subscribe.data);
        },
        error: (error: Error) =>
          console.log("4 value error: ", JSON.stringify(error, null, 2)),
      });
      console.log("5 subscribeToChannel: ", subscription);
      return subscription;
    };

    const sub = subscribeToChannel(id);

    return () => {
      sub.then((subscription) => subscription?.unsubscribe());
    };
  }, [id]); // Asegúrate de incluir `id` como dependencia aquí

  return { notifications, data, received };
};

export default useSuscribeGraphql;
