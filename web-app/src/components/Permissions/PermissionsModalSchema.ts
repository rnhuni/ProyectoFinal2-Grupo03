import { z } from "zod";

export const permissionsModalSchema = z.object({
    resource: z
        .string()
        .min(3, { message: 'permissions.validations.resource' }),
    name: z
        .string()
        .min(3, { message: 'permissions.validations.name' }),
    description: z
        .string()
        .min(10, { message: 'permissions.validations.description' })
});