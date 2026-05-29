import type { TFunction } from "i18next";
import type { PostConfigResponseBody } from "@/types/rest.types";
import { formatQueuedActionToast } from "@/utils/configCardFormat.utils";

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
