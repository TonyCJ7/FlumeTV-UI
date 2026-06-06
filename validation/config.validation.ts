import type { TFunction } from "i18next";
import { z } from "zod";
import { CONFIG_DISPLAY_NAME_MAX_LEN } from "@/constants/config.constants";
import { createEpgOffsetInputSchema, createHttpUrlSchema } from "@/validation/shared.validation";

function createConfigNameSchema(t: TFunction) {
  return z
    .string()
    .trim()
    .min(1, t("Validation.Error_ConfigNameRequired"))
    .max(
      CONFIG_DISPLAY_NAME_MAX_LEN,
      t("Validation.Error_ConfigNameMaxLength", {
        max: CONFIG_DISPLAY_NAME_MAX_LEN,
      }),
    );
}

export function createAddConfigDirectFormSchema(t: TFunction) {
  const httpUrlSchema = createHttpUrlSchema(t);
  const configNameSchema = createConfigNameSchema(t);

  return z
    .object({
      configName: configNameSchema,
      epgOffset: createEpgOffsetInputSchema(t),
      epgUrl: z.string().trim(),
      hasCustomEpg: z.boolean(),
      m3uUrl: httpUrlSchema,
    })
    .superRefine((values, ctx) => {
      if (values.hasCustomEpg && values.epgUrl === "") {
        ctx.addIssue({
          code: "custom",
          message: t("Validation.Error_EpgUrlRequiredWhenEnabled"),
          path: ["epgUrl"],
        });
      }

      if (values.hasCustomEpg && values.epgUrl !== "") {
        const urlResult = httpUrlSchema.safeParse(values.epgUrl);
        if (!urlResult.success) {
          ctx.addIssue({
            code: "custom",
            message: urlResult.error.issues[0]?.message ?? t("Validation.Error_UrlInvalid"),
            path: ["epgUrl"],
          });
        }
      }
    });
}

export type AddConfigDirectFormValues = z.infer<ReturnType<typeof createAddConfigDirectFormSchema>>;

const xtreamEpgSourceSchema = z.enum(["panel", "custom"]);

export function createAddConfigXtreamFormSchema(t: TFunction) {
  const httpUrlSchema = createHttpUrlSchema(t);
  const configNameSchema = createConfigNameSchema(t);

  return z
    .object({
      configName: configNameSchema,
      customEpgUrl: z.string().trim(),
      epgOffset: createEpgOffsetInputSchema(t),
      epgSource: xtreamEpgSourceSchema,
      epgUrl: z.string().trim(),
      hasCustomEpg: z.boolean(),
      panelPassword: z.string().min(1, t("Validation.Error_PanelPasswordRequired")),
      panelUrl: httpUrlSchema,
      panelUsername: z.string().trim().min(1, t("Validation.Error_PanelUsernameRequired")),
    })
    .superRefine((values, ctx) => {
      if (!values.hasCustomEpg) {
        return;
      }

      if (values.epgSource === "custom") {
        if (values.customEpgUrl === "") {
          ctx.addIssue({
            code: "custom",
            message: t("Validation.Error_CustomEpgUrlRequired"),
            path: ["customEpgUrl"],
          });
          return;
        }

        const urlResult = httpUrlSchema.safeParse(values.customEpgUrl);
        if (!urlResult.success) {
          ctx.addIssue({
            code: "custom",
            message: urlResult.error.issues[0]?.message ?? t("Validation.Error_UrlInvalid"),
            path: ["customEpgUrl"],
          });
        }
        return;
      }

      if (values.epgSource === "panel" && values.epgUrl !== "") {
        const urlResult = httpUrlSchema.safeParse(values.epgUrl);
        if (!urlResult.success) {
          ctx.addIssue({
            code: "custom",
            message: urlResult.error.issues[0]?.message ?? t("Validation.Error_UrlInvalid"),
            path: ["epgUrl"],
          });
        }
      }
    });
}

export type AddConfigXtreamFormValues = z.infer<ReturnType<typeof createAddConfigXtreamFormSchema>>;
