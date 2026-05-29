import type { TFunction } from "i18next";
import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "@/constants/auth.constants";
import { createPasswordFieldSchema } from "@/validation/shared.validation";

export function createChangePasswordFormSchema(t: TFunction) {
  return z
    .object({
      confirmNewPassword: z
        .string()
        .trim()
        .min(1, t("Validation.Error_ConfirmNewPasswordRequired")),
      currentPassword: z.string().trim().min(1, t("Validation.Error_CurrentPasswordRequired")),
      newPassword: createPasswordFieldSchema(t),
    })
    .superRefine((values, ctx) => {
      if (
        values.currentPassword.length >= MIN_PASSWORD_LENGTH &&
        values.newPassword === values.currentPassword
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("Validation.Error_NewPasswordMustDiffer"),
          path: ["newPassword"],
        });
      }

      if (values.newPassword !== values.confirmNewPassword) {
        ctx.addIssue({
          code: "custom",
          message: t("Validation.Error_NewPasswordsMismatch"),
          path: ["confirmNewPassword"],
        });
      }
    });
}

export type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordFormSchema>>;
