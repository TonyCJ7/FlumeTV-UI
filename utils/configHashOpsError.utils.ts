import type { TFunction } from "i18next";
import { REST_ERROR_CODES } from "@/constants/restError.constants";
import type { ConfigHashOp } from "@/types/configHashOps.types";
import type { RestApiFailureInput } from "@/types/restError.types";
import {
  isRestApiFallbackCode,
  parseRestApiErrorCode,
  resolveRestFallbackMessage,
} from "@/utils/restError.utils";

/** API failures for delete / refetch / cancel / active — toast on the config page. */
export function mapConfigHashOpsApiFailure(
  operation: ConfigHashOp,
  failure: RestApiFailureInput,
  t: TFunction,
): string {
  if (isRestApiFallbackCode(failure.code)) {
    return resolveRestFallbackMessage(failure.code, failure.message, t);
  }

  const code = parseRestApiErrorCode(failure.code);
  if (code !== null) {
    switch (code) {
      case REST_ERROR_CODES.QUEUE_BACKLOG_EXCEEDED:
        return failure.message || t("Configs.Error_QueueBacklogExceeded");
      case REST_ERROR_CODES.HASH_SYNC_ALREADY_ACTIVE:
        return failure.message || t("Configs.Error_HashSyncAlreadyActive");
      case REST_ERROR_CODES.HASH_CONFIG_NOT_FOUND:
      case REST_ERROR_CODES.HASH_NOT_LINKED_TO_USER:
        return failure.message || t("Configs.Error_HashOpNotFound");
      case REST_ERROR_CODES.HASH_CANCEL_NOT_AUTHORIZED:
        return failure.message || t("Configs.Error_HashCancelNotAuthorized");
      case REST_ERROR_CODES.HASH_NO_ACTIVE_SYNC_TO_CANCEL:
        return failure.message || t("Configs.Error_HashNoActiveSyncToCancel");
      case REST_ERROR_CODES.AUTH_SESSION_MISSING:
      case REST_ERROR_CODES.AUTH_SESSION_INVALID:
        return failure.message || t("Configs.Error_SessionRequired");
    }
  }

  switch (operation) {
    case "delete":
      return failure.message || t("Configs.Error_DeleteConfigFailed");
    case "refetch":
      return failure.message || t("Configs.Error_RefetchFailed");
    case "cancel":
      return failure.message || t("Configs.Error_CancelSyncFailed");
    case "active":
      return failure.message || t("Configs.Error_ActiveToggleFailed");
  }
}
