export interface SubscriptionPlan {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
  subscription_plan: SubscriptionPlan;
  created_at: string;
  updated_at: string;
}

export interface UseClientsResult {
  clients: Client[];
  loading: boolean;
  error: string | null;
}
