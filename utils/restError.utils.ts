import axios from "axios";
import { RestApiError } from "@/infra/restApiError";
import { REST_API_FALLBACK_CODES, REST_ERROR_CODES } from "@/constants/restError.constants";
import type { TFunction } from "i18next";
import type { RestApiErrorCode, RestApiFallbackCode, RestErrorBody } from "@/types/restError.types";
import { isJsonObject } from "@/utils/json.utils";

export function isSessionRestErrorCode(code: string): boolean {
  return (
    code === REST_ERROR_CODES.AUTH_SESSION_MISSING || code === REST_ERROR_CODES.AUTH_SESSION_INVALID
  );
}

function isRestErrorBody(value: unknown): value is RestErrorBody {
  if (!isJsonObject(value)) {
    return false;
  }
  return typeof value.code === "string" && typeof value.message === "string";
}

/** Client-only REST fallback copy — `t()` literals for i18n scanners. */
export function mapRestFallbackCodeToMessage(code: RestApiFallbackCode, t: TFunction): string {
  switch (code) {
    case REST_API_FALLBACK_CODES.REQUEST_TIMEOUT:
      return t("RestError.Message_RequestTimedOut");
    case REST_API_FALLBACK_CODES.NETWORK_UNREACHABLE:
      return t("RestError.Message_NetworkUnreachable");
    case REST_API_FALLBACK_CODES.UNKNOWN:
      return t("RestError.Message_Unexpected");
  }
}

function parseRestErrorBody(value: unknown): RestErrorBody | null {
  if (!isRestErrorBody(value)) {
    return null;
  }
  return {
    code: value.code.trim(),
    message: value.message.trim(),
  };
}

export function toRestApiError(error: unknown): RestApiError {
  if (error instanceof RestApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const httpStatus = error.response?.status ?? null;
    const body = parseRestErrorBody(error.response?.data);

    if (body) {
      return new RestApiError({
        code: body.code as RestApiErrorCode,
        message: body.message,
        httpStatus,
      });
    }

    if (error.code === "ECONNABORTED") {
      return new RestApiError({
        code: REST_API_FALLBACK_CODES.REQUEST_TIMEOUT,
        message: error.message,
        httpStatus,
      });
    }

    if (!error.response) {
      return new RestApiError({
        code: REST_API_FALLBACK_CODES.NETWORK_UNREACHABLE,
        message: error.message,
        httpStatus: null,
      });
    }

    return new RestApiError({
      code: REST_API_FALLBACK_CODES.UNKNOWN,
      message: error.message,
      httpStatus,
    });
  }

  throw error;
}
