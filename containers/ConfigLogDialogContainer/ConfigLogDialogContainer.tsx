"use client";

import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import { useDialogFullScreen } from "@/hooks/useLayoutMode";
import { ConfigLogViewer } from "@/components/core/ConfigLogViewer";
import { Styled } from "@/containers/ConfigLogDialogContainer/ConfigLogDialogContainer.styled";
import { DialogShell, FeedbackBanner } from "@/components/design-system";
import { useConfigLogStream } from "@/hooks/useConfigLogStream";
import { selectConfigByHash } from "@/store/configs/configsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPrefetchEntry } from "@/store/prefetchStatus/prefetchStatusSelectors";
import {
  closeLogDialog,
  selectLogDialogHash,
  selectLogDialogOpen,
  selectLogLines,
} from "@/store/ui/uiSlice";
import {
  extractProgressPercent,
  resolveLogDialogSyncProgress,
} from "@/utils/configCardFormat.utils";

export function ConfigLogDialogContainer() {
  const { t } = useTranslation();
  const isMobile = useDialogFullScreen();
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectLogDialogOpen);
  const hash = useAppSelector(selectLogDialogHash);
  const lines = useAppSelector(selectLogLines);
  const prefetchEntry = useAppSelector((state) =>
    hash ? selectPrefetchEntry(hash)(state) : undefined,
  );
  const listItem = useAppSelector(hash ? selectConfigByHash(hash) : () => undefined);

  const streamStatus = useConfigLogStream(open, hash);

  const resolvedProgress = resolveLogDialogSyncProgress(prefetchEntry, listItem);
  const progressPercent = extractProgressPercent(resolvedProgress);

  const title =
    progressPercent != null
      ? t("ConfigCard.LogDialog_TitleWithPercent", { percent: progressPercent })
      : t("ConfigCard.LogDialog_Title");

  const showStreamError = streamStatus === "error" && lines.length === 0;

  return (
    <DialogShell
      open={open}
      fullScreen={isMobile}
      onClose={() => dispatch(closeLogDialog())}
      onDismiss={() => dispatch(closeLogDialog())}
      title={title}
      closeAriaLabel={t("Common.ButtonLabel_Close")}
      maxWidth="md"
    >
      <Styled.LogBody>
        <Styled.LogHint variant="body2" color="text.secondary">
          {t("ConfigCard.LogDialog_BodyHint")}
        </Styled.LogHint>
        {showStreamError ? (
          <FeedbackBanner severity="error" role="alert">
            {t("ConfigCard.LogDialog_ConnectionError")}
          </FeedbackBanner>
        ) : null}
        <ConfigLogViewer
          lines={lines}
          emptyLabel={t("ConfigCard.LogDialog_Empty")}
          ariaLabel={t("ConfigCard.LogDialog_LinesAria")}
        />
      </Styled.LogBody>
    </DialogShell>
  );
}
