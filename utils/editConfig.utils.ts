import type { TFunction } from "i18next";
import { REST_ERROR_CODES } from "@/constants/restError.constants";
import type { PutConfigResponseBody } from "@/types/rest.types";
import type { RestApiFailureInput } from "@/types/restError.types";
import { formatQueuedActionToast } from "@/utils/configCardFormat.utils";
import { classifyPutConfigResponse } from "@/utils/config.utils";
import {
  isRestApiFallbackCode,
  parseRestApiErrorCode,
  resolveRestFallbackMessage,
} from "@/utils/restError.utils";

/** API failures for edit-config use a toast (not inline URL errors). */
export function mapEditConfigApiFailure(failure: RestApiFailureInput, t: TFunction): string {
  if (isRestApiFallbackCode(failure.code)) {
    return resolveRestFallbackMessage(failure.code, failure.message, t);
  }

  const code = parseRestApiErrorCode(failure.code);
  if (code === null) {
    return failure.message || t("Configs.Error_EditConfigFailed");
  }

  switch (code) {
    case REST_ERROR_CODES.CONFIG_BODY_INVALID:
      return failure.message || t("Configs.Error_EditConfigBodyInvalid");
    case REST_ERROR_CODES.CONFIG_PROVIDER_URL_NOT_ALLOWED:
      return failure.message || t("Configs.Error_ProviderUrlNotAllowed");
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

/** Success toast copy from `PUT /api/configs/:hash` response branches. */
export function formatEditConfigSuccessMessage(
  response: PutConfigResponseBody,
  t: TFunction,
): string | null {
  const outcome = classifyPutConfigResponse(response);

  if (outcome === "unchanged") {
    return t("Configs.Toast_EditNoChanges");
  }

  if (outcome === "nameOnly") {
    return t("Configs.Toast_EditNameUpdated");
  }

  if (outcome === "hashTransition" && "linkStatus" in response) {
    if (response.syncEnqueued && response.queuePosition != null) {
      return formatQueuedActionToast(t, response.queuePosition, response.estimatedWaitMs, {
        withWait: "Configs.Toast_EditUpdatedQueuedWithWait",
        withoutWait: "Configs.Toast_EditUpdatedQueued",
      });
    }

    if (response.enqueueErrorCode) {
      return t("Configs.Toast_EditUpdatedEnqueueSkipped");
    }
  }

  return t("Configs.Toast_EditUpdated");
}
