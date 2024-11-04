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
