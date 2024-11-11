export interface Client {
  id: string;
  name: string;
  description: string;
  subscription_plan: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}
