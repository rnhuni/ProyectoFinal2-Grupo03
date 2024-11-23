export interface User {
    client: string;
    email: string;
    id: string;
    name: string;
    role: string;
    status: string;
}

export interface View {
    actions: string[];
    id: string;
    menu: string;
}

export interface FeaturesObject {
    features: string[];
    user: User;
    views: View[];
    language: string;
    dashboard_url: string;
    dashboard_url_es: string;
}
