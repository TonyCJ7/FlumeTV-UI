import type {
  AddConfigDirectFormValues,
  AddConfigXtreamFormValues,
} from "@/validation/config.validation";
import type {
  ConfigListItemDirect,
  ConfigListItemXtream,
  PostConfigDirectRequestBody,
  PostConfigXtreamRequestBody,
  PutConfigResponseBody,
} from "@/types/rest.types";

function formatEpgOffsetForForm(offset: number): string {
  return offset === 0 ? "" : String(offset);
}

function parseEpgOffsetInput(raw: string): number {
  const trimmed = raw.trim();
  return trimmed === "" ? 0 : Number(trimmed);
}

type PutConfigOutcome = "unchanged" | "nameOnly" | "hashTransition";

/** Classifies `PUT /api/configs/:hash` response shape for UI branches. */
export function classifyPutConfigResponse(response: PutConfigResponseBody): PutConfigOutcome {
  if (response.unchanged === true) {
    return "unchanged";
  }

  if ("linkStatus" in response) {
    return "hashTransition";
  }

  return "nameOnly";
}

export function configListItemToDirectFormValues(
  item: ConfigListItemDirect,
): AddConfigDirectFormValues {
  return {
    configName: item.configName,
    m3uUrl: item.m3uUrl,
    hasCustomEpg: item.hasCustomEpg,
    epgUrl: item.epgUrl ?? "",
    epgOffset: formatEpgOffsetForForm(item.epgOffset),
  };
}

export function configListItemToXtreamFormValues(
  item: ConfigListItemXtream,
): AddConfigXtreamFormValues {
  const epgEnabled = item.hasCustomEpg || item.epgUrl != null;

  return {
    configName: item.configName,
    panelUrl: item.panelUrl,
    panelUsername: item.panelUsername,
    panelPassword: "",
    hasCustomEpg: epgEnabled,
    epgSource: item.hasCustomEpg ? "custom" : "panel",
    customEpgUrl: item.customEpg ?? "",
    epgUrl: item.epgUrl ?? "",
    epgOffset: formatEpgOffsetForForm(item.epgOffset),
  };
}

export function toPostConfigDirectRequestBody(
  values: AddConfigDirectFormValues,
): PostConfigDirectRequestBody {
  const epgOffset = parseEpgOffsetInput(values.epgOffset);
  const hasCustomEpg = values.hasCustomEpg;

  return {
    type: "direct",
    configName: values.configName,
    epgOffset,
    epgUrl: hasCustomEpg && values.epgUrl ? values.epgUrl : null,
    hasCustomEpg,
    m3uUrl: values.m3uUrl,
  };
}

export function toPostConfigXtreamRequestBody(
  values: AddConfigXtreamFormValues,
): PostConfigXtreamRequestBody {
  const epgOffset = parseEpgOffsetInput(values.epgOffset);
  const hasCustomEpg = values.hasCustomEpg;
  const useCustomEpg = hasCustomEpg && values.epgSource === "custom";

  return {
    type: "xtream",
    configName: values.configName,
    customEpg: useCustomEpg && values.customEpgUrl ? values.customEpgUrl : null,
    epgOffset,
    epgUrl: hasCustomEpg && values.epgSource === "panel" && values.epgUrl ? values.epgUrl : null,
    hasCustomEpg: useCustomEpg,
    panelPassword: values.panelPassword,
    panelUrl: values.panelUrl,
    panelUsername: values.panelUsername,
  };
}
