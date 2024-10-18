import { z } from "zod";
import { permissionsModalSchema } from "../Permissions/PermissionsModalSchema";

export const roleSchema = z.object({
    id: z.number(),
    name: z.string().min(3, 'permissions.validations.name'), 
    description: z.string().min(10, 'permissions.validations.description'), 
    permissions: z.array(permissionsModalSchema)
  });