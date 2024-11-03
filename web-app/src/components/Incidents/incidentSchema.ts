// Ajuste en incidentSchema.js
import { z } from "zod";
import i18next from "i18next";

const incidentSchema = z.object({
  type: z
    .string()
    .min(1, {
      message: i18next.t("incidentScreen.errors.incidentTypeRequired"),
    }),
  description: z
    .string()
    .min(1, {
      message: i18next.t("incidentScreen.errors.incidentDescriptionRequired"),
    })
    .max(200, {
      message: i18next.t("incidentScreen.errors.incidentDescriptionMaxLength"),
    }),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        content_type: z.string(),
        file_name: z.string(),
        file_uri: z.string(),
      })
    )
    .optional(),
});

export default incidentSchema;
