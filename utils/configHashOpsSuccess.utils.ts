import type { TFunction } from "i18next";
import type {
  DeleteConfigResponseBody,
  PostHashCancelResponseBody,
  PostHashRefetchResponseBody,
} from "@/types/rest.types";
import { formatQueuedActionToast } from "@/utils/configCardFormat.utils";

export function formatDeleteConfigSuccessMessage(
  response: DeleteConfigResponseBody,
  t: TFunction,
): string {
  if (response.hashRemovedFromServer) {
    return t("Configs.Toast_SourceRemovedFromServer");
  }
  if (response.hashUnlinked) {
    return t("Configs.Toast_SourceUnlinked");
  }
  return t("Configs.Toast_SourceRemoved");
}

export function formatRefetchConfigSuccessMessage(
  response: PostHashRefetchResponseBody,
  t: TFunction,
): string {
  return formatQueuedActionToast(t, response.queuePosition, response.estimatedWaitMs, {
    withWait: "Configs.Toast_RefetchQueuedWithWait",
    withoutWait: "Configs.Toast_RefetchQueued",
  });
}

export function formatCancelConfigSuccessMessage(
  response: PostHashCancelResponseBody,
  t: TFunction,
): string {
  if (response.kind === "running") {
    return t("Configs.Toast_CancelSyncRunning");
  }
  return t("Configs.Toast_CancelSyncQueued");
}

export function formatActiveToggleSuccessMessage(isActive: boolean, t: TFunction): string {
  if (isActive) {
    return t("Configs.Toast_SourceActivated");
  }
  return t("Configs.Toast_SourceDeactivated");
}
