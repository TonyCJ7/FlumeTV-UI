import type { TFunction } from "i18next";
import type { PutConfigResponseBody } from "@/types/rest.types";
import { formatQueuedActionToast } from "@/utils/configCardFormat.utils";
import { classifyPutConfigResponse } from "@/utils/config.utils";

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
