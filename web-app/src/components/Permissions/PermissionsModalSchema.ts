import { z } from "zod";

export const permissionsModalSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'permissions.validations.name' }),
    description: z
        .string()
        .min(10, { message: 'permissions.validations.description' }),
    status: z.enum(["Active", "Completed", "Inactive"]).default("Active")
});