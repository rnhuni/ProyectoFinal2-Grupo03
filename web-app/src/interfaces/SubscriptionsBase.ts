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
  createdAt: string;
  description: string;
  features: Feature[];
  id: string;
  notifyByEmail: boolean;
  price: number;
  updatedAt: string;
}

export interface ActiveSubscriptionHistory {
  baseId: string;
  baseName: string;
  createdAt: string;
  description: string;
  features: Feature[];
  id: string;
  notifyByEmail: boolean;
  price: number;
  updatedAt: string;
}


export interface UpdateActiveSubscriptionData {
  notifyByEmail: boolean;
  subscriptionBaseId: string;
  features: string[];
}