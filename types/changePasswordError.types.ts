export type ChangePasswordFormField = "currentPassword" | "newPassword" | "form";

export type MappedChangePasswordError = Readonly<{
  field: ChangePasswordFormField;
  code: string;
  message: string;
}>;

export type ChangePasswordFailureInput = Readonly<{
  code: string;
  message: string;
  httpStatus?: number | null;
}>;
