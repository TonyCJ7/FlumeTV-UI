import { REST_ERROR_CODES } from "@/constants/restError.constants";
import type { RestApiErrorCode } from "@/types/restError.types";

export class RestApiError extends Error {
  readonly code: RestApiErrorCode;
  readonly httpStatus: number | null;
  readonly restMessage: string;

  constructor(params: { code: RestApiErrorCode; message: string; httpStatus?: number | null }) {
    super(params.message);
    this.name = "RestApiError";
    this.code = params.code;
    this.httpStatus = params.httpStatus ?? null;
    this.restMessage = params.message;
  }

  get isSessionError(): boolean {
    return (
      this.code === REST_ERROR_CODES.AUTH_SESSION_MISSING ||
      this.code === REST_ERROR_CODES.AUTH_SESSION_INVALID
    );
  }
}
