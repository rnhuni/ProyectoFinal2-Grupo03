export interface Subscription {
  id: number;
  userName: string;
  currentPlan: string;
  description: string;
  subscriptionDate: string;
  amountPaid: number;
  nextBillingDate: string;
  status: "active" | "inactive" | "suspended";
}

export interface Feature {
  id: string;
  name: string;
  price: number;
}

export interface BaseSubscription {
  id: string;
  name: string;
  description: string;
  features: Feature[];
  price: number;
  status: "request_open" | "active";
  created_at: string;
  updated_at: string;
}

export interface SubscriptionBase {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  features: Feature[];
}

export interface ActiveSubscription {
  baseId: string;
  baseName: string;
  created_at: string;
  description: string;
  features: Feature[];
  id: string;
  notifyByEmail: boolean;
  price: number;
  updated_at: string;
}

export interface ActiveSubscriptionHistory {
  baseId: string;
  baseName: string;
  created_at: string;
  description: string;
  features: Feature[];
  id: string;
  notifyByEmail: boolean;
  price: number;
  updated_at: string;
}

export interface UpdateActiveSubscriptionData {
  notifyByEmail: boolean;
  subscriptionBaseId: string;
  features: string[];
}

export interface NewSubscriptionData {
  notifyByEmail: boolean;
  subscriptionBaseId: string;
  features: string[]; // IDs de las características seleccionadas
}
