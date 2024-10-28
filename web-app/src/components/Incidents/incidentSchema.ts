import { z } from "zod";
import i18next from "i18next";

const incidentSchema = z.object({
  incidentType: z
    .string()
    .min(1, {
      message: i18next.t("incidentScreen.errors.incidentTypeRequired"),
    })
    .refine(
      (val) =>
        ["technical", "billing", "general", "security", "maintenance"].includes(
          val
        ),
      {
        message: i18next.t("incidentScreen.errors.incidentTypeInvalid"),
      }
    ),
  incidentDescription: z
    .string()
    .min(1, {
      message: i18next.t("incidentScreen.errors.incidentDescriptionRequired"),
    })
    .max(200, {
      message: i18next.t("incidentScreen.errors.incidentDescriptionMaxLength"),
    }),
  attachment: z
    .instanceof(File, {
      message: i18next.t("incidentScreen.errors.attachmentRequired"),
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: i18next.t("incidentScreen.errors.attachmentFileSize"),
    })
    .refine(
      (file) =>
        [
          "text/csv",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ].includes(file.type),
      {
        message: i18next.t("incidentScreen.errors.attachmentFileType"),
      }
    ),
});

export default incidentSchema;
