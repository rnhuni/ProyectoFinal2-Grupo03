import { useEffect, useState } from 'react';
import subscribeChannelFunc from '../../api/notifications';

const useNotificationsGraphql = (id: string) => {
    const [notifications, setNotifications] = useState<string[]>([]);
    const [data, setData] = useState('');
    const [received, setReceived] = useState('');
    console.log("useNotifications: ", id)

    /** LLAMADO A GRAPHQL para lectura del chat */
    useEffect(() => {
        const subscribeToChannel = async (id: string) => {
            const subscription = subscribeChannelFunc(id).subscribe({
                next: ({ value }: { value: { data: { subscribe: { data: string } } } }) => {
                    console.log("value: ", value);
                    setReceived(value.data.subscribe.data);
                },
                error: (error: any) => console.log("value: ", error),
            });
            console.log("subscribeToChannel: ", subscription)
            return subscription;
        };

        const sub = subscribeToChannel(id);

        return () => {
            sub.then(subscription => subscription.unsubscribe());
        };
    }, [id]);  // Asegúrate de incluir `id` como dependencia aquí

    return { notifications, data, received };
};

export default useNotificationsGraphql;
