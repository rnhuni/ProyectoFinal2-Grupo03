import { z } from "zod";
import { permissionSchema } from "./RolePermissionsSchema";

export const roleSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "permissions.validations.name"),
  description: z.string().min(10, "permissions.validations.description"),
  permissions: z.array(permissionSchema),
});
