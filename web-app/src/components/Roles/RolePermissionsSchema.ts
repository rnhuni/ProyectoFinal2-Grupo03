import { z } from "zod";

export const actionSchema = z.enum(["write", "read", "update", "delete"]);

export const permissionSchema = z.object({
  id: z.string(),
  actions: z.array(actionSchema),
});

export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  permissions: z.array(permissionSchema),
});
