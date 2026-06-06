export type AuthDialogMode = "login" | "register";

export type ChangePasswordFormField = "currentPassword" | "newPassword" | "form";

export type MappedChangePasswordError = Readonly<{
  field: ChangePasswordFormField;
  code: string;
  message: string;
}>;
