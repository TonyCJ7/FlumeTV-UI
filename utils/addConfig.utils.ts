import type { TFunction } from "i18next";
import { REST_ERROR_CODES } from "@/constants/restError.constants";
import type { PostConfigResponseBody } from "@/types/rest.types";
import type { RestApiFailureInput } from "@/types/restError.types";
import { formatQueuedActionToast } from "@/utils/configCardFormat.utils";
import {
  isRestApiFallbackCode,
  parseRestApiErrorCode,
  resolveRestFallbackMessage,
} from "@/utils/restError.utils";

/** API failures for add-config use a toast (not inline URL errors). */
export function mapAddConfigApiFailure(failure: RestApiFailureInput, t: TFunction): string {
  if (isRestApiFallbackCode(failure.code)) {
    return resolveRestFallbackMessage(failure.code, failure.message, t);
  }

  const code = parseRestApiErrorCode(failure.code);
  if (code === null) {
    return failure.message || t("Configs.Error_AddConfigFailed");
  }

  switch (code) {
    case REST_ERROR_CODES.CONFIG_BODY_INVALID:
      return failure.message || t("Configs.Error_AddConfigBodyInvalid");
    case REST_ERROR_CODES.CONFIG_PROVIDER_URL_NOT_ALLOWED:
      return failure.message || t("Configs.Error_ProviderUrlNotAllowed");
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

/** Success toast copy from `POST /api/configs` response hints. */
export function formatAddConfigSuccessMessage(
  response: PostConfigResponseBody,
  t: TFunction,
): string {
  if (response.linkStatus === "linked-existing") {
    return t("Configs.Toast_SourceLinked");
  }

  if (response.syncEnqueued && response.queuePosition != null) {
    return formatQueuedActionToast(t, response.queuePosition, response.estimatedWaitMs, {
      withWait: "Configs.Toast_SourceAddedQueuedWithWait",
      withoutWait: "Configs.Toast_SourceAddedQueued",
    });
  }

  if (response.enqueueErrorCode) {
    return t("Configs.Toast_SourceAddedEnqueueSkipped");
  }

  return t("Configs.Toast_SourceAdded");
}
