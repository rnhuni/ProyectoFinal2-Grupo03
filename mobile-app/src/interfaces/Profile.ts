export interface Profile {
    features: string[];
    user: {
        client: string;
        email: string;
        id: string;
        name: string;
        role: string;
        status: string;
    };
    views: {
        actions: string[];
        id: string;
        menu: string;
    }[];
}