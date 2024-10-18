import { z } from "zod";

// Esquema para las acciones permitidas
export const actionSchema = z.enum(["read", "write", "update", "delete"]);

// Esquema para un permiso
export const rolePermissionSchema = z.object({
  id: z.string(), // El ID debe ser una cadena
  actions: z.array(actionSchema), // Las acciones deben ser un array de los valores permitidos
});


