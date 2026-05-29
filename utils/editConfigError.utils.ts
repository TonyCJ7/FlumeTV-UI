import type { TFunction } from "i18next";
import { REST_ERROR_CODES } from "@/constants/restError.constants";
import type { RestApiErrorCode } from "@/types/restError.types";
import { isRestApiFallbackCode } from "@/types/restError.types";
import { mapRestFallbackCodeToMessage } from "@/utils/restError.utils";

type EditConfigFailureInput = Readonly<{
  code: string;
  message: string;
  httpStatus?: number | null;
}>;

/** API failures for edit-config use a toast (not inline URL errors). */
export function mapEditConfigApiFailure(failure: EditConfigFailureInput, t: TFunction): string {
  if (isRestApiFallbackCode(failure.code)) {
    return failure.message || mapRestFallbackCodeToMessage(failure.code, t);
  }

  const code = failure.code as RestApiErrorCode;

  switch (code) {
    case REST_ERROR_CODES.CONFIG_BODY_INVALID:
      return failure.message || t("Configs.Error_EditConfigBodyInvalid");
    case REST_ERROR_CODES.QUEUE_BACKLOG_EXCEEDED:
      return failure.message || t("Configs.Error_QueueBacklogExceeded");
    case REST_ERROR_CODES.HASH_SYNC_ALREADY_ACTIVE:
      return failure.message || t("Configs.Error_HashSyncAlreadyActive");
    case REST_ERROR_CODES.HASH_CONFIG_NOT_FOUND:
    case REST_ERROR_CODES.HASH_NOT_LINKED_TO_USER:
      return failure.message || t("Configs.Error_EditConfigNotFound");
    case REST_ERROR_CODES.AUTH_SESSION_MISSING:
    case REST_ERROR_CODES.AUTH_SESSION_INVALID:
      return failure.message || t("Configs.Error_SessionRequired");
    default:
      return failure.message || t("Configs.Error_EditConfigFailed");
  }
}
