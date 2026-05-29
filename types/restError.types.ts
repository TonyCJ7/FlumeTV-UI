import { REST_API_FALLBACK_CODES, REST_ERROR_CODES } from "@/constants/restError.constants";

export type RestErrorCode = (typeof REST_ERROR_CODES)[keyof typeof REST_ERROR_CODES];

export type RestErrorBody = {
  code: string;
  message: string;
};

/** Fallback when the response is not a known REST envelope. */
export type RestApiFallbackCode =
  (typeof REST_API_FALLBACK_CODES)[keyof typeof REST_API_FALLBACK_CODES];

export type RestApiErrorCode = RestErrorCode | RestApiFallbackCode;

export function isRestApiFallbackCode(code: string): code is RestApiFallbackCode {
  return Object.values(REST_API_FALLBACK_CODES).includes(code as RestApiFallbackCode);
}
