import { z } from "zod";

export const actionSchema = z.enum(["write", "read", "update", "delete"]);

export const permissionSchema = z.object({
  id: z.string(),
  actions: z.array(actionSchema),
});

export const roleSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  permissions: z.array(permissionSchema),
});
