import { useEffect, useState } from 'react';
import { subscribeChannelFunc } from '../../api/notifications';

const useSuscribeGraphql = (id?: string) => {
    const [notifications, setNotifications] = useState<string[]>([]);
    const [data, setData] = useState('');
    const [received, setReceived] = useState('');
    const [idSubscription, setIdSubscription] = useState<string | null>(id || null);
    // console.log("1 useNotifications: ", id)

    /** LLAMADO A GRAPHQL para lectura del chat */
    useEffect(() => {
        //console.log("2 useEffect: ", idSubscription)
        if (idSubscription) {
            const subscribeToChannel = async (idSubscription: string) => {
                const subscription = (await subscribeChannelFunc(idSubscription))?.subscribe({
                    next: ({ value }: { value: { data: { subscribe: { data: string } } } }) => {
                        // console.log("3 value next: ", value);
                        setReceived(value.data.subscribe.data);
                    },
                    error: (error: any) => console.log("4 value error: ", JSON.stringify(error, null, 2))
                });
                // console.log("5 subscribeToChannel: ", subscription)
                return subscription;
            };

            const sub = subscribeToChannel(idSubscription);

            return () => {
                sub.then(subscription => subscription?.unsubscribe());
            };
        }

    }, [idSubscription]);

    const setIdSubscriptionFunc = (id: string) => { setIdSubscription(id); }

    return { received, setIdSubscriptionFunc };
};

export default useSuscribeGraphql;
