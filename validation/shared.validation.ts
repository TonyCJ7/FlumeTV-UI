import type { TFunction } from "i18next";
import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "@/constants/auth.constants";

const HTTP_URL_PATTERN = /^https?:\/\/.+/i;

export function createPasswordFieldSchema(t: TFunction) {
  return z
    .string()
    .trim()
    .min(1, t("Validation.Error_PasswordRequired"))
    .min(
      MIN_PASSWORD_LENGTH,
      t("Validation.Error_PasswordMinLength", { min: MIN_PASSWORD_LENGTH }),
    );
}

export function createHttpUrlSchema(t: TFunction) {
  return z
    .string()
    .trim()
    .min(1, t("Validation.Error_UrlRequired"))
    .refine((value) => HTTP_URL_PATTERN.test(value), {
      message: t("Validation.Error_UrlInvalid"),
    });
}

/** Signed decimal hours — empty string is valid (maps to 0 via `parseEpgOffsetInput`). */
export function createEpgOffsetInputSchema(t: TFunction) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (value === "") {
        return;
      }
      if (value === "-" || value === "." || value === "-.") {
        ctx.addIssue({
          code: "custom",
          message: t("Validation.Error_EpgOffsetInvalid"),
        });
        return;
      }
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) {
        ctx.addIssue({
          code: "custom",
          message: t("Validation.Error_EpgOffsetInvalid"),
        });
      }
    });
}

export function createUserIdFieldSchema(t: TFunction) {
  return z.string().trim().min(1, t("Validation.Error_UserIdRequired"));
}
