import type { TFunction } from "i18next";
import { REST_ERROR_CODES } from "@/constants/restError.constants";
import type { RestApiErrorCode } from "@/types/restError.types";
import { isRestApiFallbackCode } from "@/types/restError.types";
import { mapRestFallbackCodeToMessage } from "@/utils/restError.utils";

type AddConfigFailureInput = Readonly<{
  code: string;
  message: string;
  httpStatus?: number | null;
}>;

/** API failures for add-config use a toast (not inline URL errors). */
export function mapAddConfigApiFailure(failure: AddConfigFailureInput, t: TFunction): string {
  if (isRestApiFallbackCode(failure.code)) {
    return failure.message || mapRestFallbackCodeToMessage(failure.code, t);
  }

  const code = failure.code as RestApiErrorCode;

  switch (code) {
    case REST_ERROR_CODES.CONFIG_BODY_INVALID:
      return failure.message || t("Configs.Error_AddConfigBodyInvalid");
    case REST_ERROR_CODES.CONFIG_ALREADY_EXISTS: {
      const detail = failure.message.trim() || t("Configs.Error_ConfigAlreadyExists");
      return `${detail} ${t("Configs.Error_ConfigAlreadyExistsSuggestion")}`;
    }
    case REST_ERROR_CODES.QUEUE_BACKLOG_EXCEEDED:
      return failure.message || t("Configs.Error_QueueBacklogExceeded");
    case REST_ERROR_CODES.AUTH_SESSION_MISSING:
    case REST_ERROR_CODES.AUTH_SESSION_INVALID:
      return failure.message || t("Configs.Error_SessionRequired");
    default:
      return failure.message || t("Configs.Error_AddConfigFailed");
  }
}
