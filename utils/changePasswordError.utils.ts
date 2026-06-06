import type { TFunction } from "i18next";
import { REST_ERROR_CODES } from "@/constants/restError.constants";
import type { MappedChangePasswordError } from "@/types/auth.types";
import type { RestApiFailureInput } from "@/types/restError.types";
import {
  isRestApiFallbackCode,
  parseRestApiErrorCode,
  resolveRestFallbackMessage,
} from "@/utils/restError.utils";

export function mapChangePasswordApiFailure(
  failure: RestApiFailureInput,
  t: TFunction,
): MappedChangePasswordError {
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
      message: resolveRestFallbackMessage(failure.code, failure.message, t),
    };
  }

  const code = parseRestApiErrorCode(failure.code);
  if (code === null) {
    return {
      field: "form",
      code: failure.code,
      message: failure.message || t("Common.State_GenericErrorHeading"),
    };
  }

  switch (code) {
    case REST_ERROR_CODES.CHANGE_PASSWORD_CURRENT_INVALID:
      return {
        field: "currentPassword",
        code: failure.code,
        message: failure.message,
      };
    case REST_ERROR_CODES.REGISTER_PASSWORD_INVALID:
      return {
        field: "newPassword",
        code: failure.code,
        message: failure.message,
      };
    case REST_ERROR_CODES.CHANGE_PASSWORD_BODY_INVALID:
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
