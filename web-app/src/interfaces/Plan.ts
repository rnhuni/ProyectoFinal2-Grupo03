import { RolePlan } from "./Role";

export interface Plan {
  id: string;
  name: string;
  description: string;
  status: string;
  price: number;
  features: string | string[];
  roles: RolePlan[];
}
