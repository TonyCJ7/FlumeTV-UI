import axios from "axios";
import { RestApiError } from "@/infra/restApiError";
import { REST_API_FALLBACK_CODES, REST_ERROR_CODES } from "@/constants/restError.constants";
import type { TFunction } from "i18next";
import type { RestApiErrorCode, RestApiFallbackCode, RestErrorBody } from "@/types/restError.types";
import { isJsonObject } from "@/utils/json.utils";

export function isRestApiFallbackCode(code: string): code is RestApiFallbackCode {
  return Object.values(REST_API_FALLBACK_CODES).includes(code as RestApiFallbackCode);
}

export function parseRestApiErrorCode(code: string): RestApiErrorCode | null {
  if ((Object.values(REST_ERROR_CODES) as string[]).includes(code)) {
    return code as RestApiErrorCode;
  }
  if ((Object.values(REST_API_FALLBACK_CODES) as string[]).includes(code)) {
    return code as RestApiErrorCode;
  }
  return null;
}

function isRestErrorBody(value: unknown): value is RestErrorBody {
  if (!isJsonObject(value)) {
    return false;
  }
  return typeof value.code === "string" && typeof value.message === "string";
}

export function resolveRestFallbackMessage(
  code: RestApiFallbackCode,
  message: string,
  t: TFunction,
): string {
  return message || mapRestFallbackCodeToMessage(code, t);
}

/** Client-only REST fallback copy — `t()` literals for i18n scanners. */
function mapRestFallbackCodeToMessage(code: RestApiFallbackCode, t: TFunction): string {
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
        code: parseRestApiErrorCode(body.code) ?? REST_API_FALLBACK_CODES.UNKNOWN,
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
