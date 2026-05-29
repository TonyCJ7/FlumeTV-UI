import type { TFunction } from "i18next";
import { REST_ERROR_CODES } from "@/constants/restError.constants";
import type { RestApiErrorCode } from "@/types/restError.types";
import { isRestApiFallbackCode } from "@/types/restError.types";
import type { AuthDialogMode } from "@/store/auth/authSlice";
import { mapRestFallbackCodeToMessage } from "@/utils/restError.utils";

type AuthFormField = "userId" | "password" | "form";

type MappedAuthError = Readonly<{
  field: AuthFormField;
  code: string;
  message: string;
}>;

type AuthFailureInput = Readonly<{
  code: string;
  message: string;
  httpStatus?: number | null;
}>;

export function mapAuthApiFailure(
  failure: AuthFailureInput,
  mode: AuthDialogMode,
  t: TFunction,
): MappedAuthError {
  if (failure.httpStatus === 429) {
    return {
      field: "form",
      code: "RATE_LIMIT",
      message: t("Auth.Error_RateLimited"),
    };
  }

  if (isRestApiFallbackCode(failure.code)) {
    return {
      field: "form",
      code: failure.code,
      message: failure.message || mapRestFallbackCodeToMessage(failure.code, t),
    };
  }

  const code = failure.code as RestApiErrorCode;

  switch (code) {
    case REST_ERROR_CODES.AUTH_INVALID_CREDENTIALS:
      return {
        field: "password",
        code: failure.code,
        message: failure.message,
      };
    case REST_ERROR_CODES.REGISTER_PASSWORD_INVALID:
      return {
        field: "password",
        code: failure.code,
        message: failure.message,
      };
    case REST_ERROR_CODES.AUTH_BODY_INVALID:
      return {
        field: mode === "login" ? "userId" : "password",
        code: failure.code,
        message: failure.message,
      };
    case REST_ERROR_CODES.REGISTER_FAILED:
    case REST_ERROR_CODES.AUTH_SERVER_MISCONFIGURED:
    case REST_ERROR_CODES.REGISTER_USER_ID_CONFLICT:
      return {
        field: "form",
        code: failure.code,
        message: failure.message,
      };
    default:
      return {
        field: "form",
        code: failure.code,
        message: failure.message || t("Common.State_GenericErrorHeading"),
      };
  }
}
