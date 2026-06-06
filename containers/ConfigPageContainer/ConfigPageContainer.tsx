"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ConfigSourceCard, type ConfigSourceCardLabels } from "@/components/core/ConfigSourceCard";
import {
  bandToStatusVariant,
  buildConfigCardDetailRows,
  buildConfigSourceCardCtaVisibility,
  buildConfigSourceCardStatusDisplay,
  shouldShowConfigCardPrefetchWarning,
} from "@/utils/configCardDisplay.utils";
import {
  ConfigListEmpty,
  ConfigListGrid,
  ConfigSourceListSkeleton,
} from "@/components/core/ConfigSourceList";
import { FeedbackBanner, ToastSnackbar, ToastWell } from "@/components/design-system";
import { AddConfigDialogContainer } from "@/containers/AddConfigDialogContainer";
import {
  ConfigConfirmDialogContainer,
  type ConfigPageToastState,
} from "@/containers/ConfigConfirmDialogContainer";
import { ConfigLogDialogContainer } from "@/containers/ConfigLogDialogContainer";
import { EditConfigDialogContainer } from "@/containers/EditConfigDialogContainer";
import { Styled } from "@/containers/ConfigPageContainer/ConfigPageContainer.styled";
import { ACTIVE_TOGGLE_MIN_LOADING_MS } from "@/constants/config.constants";
import { usePrefetchStatusStream } from "@/hooks/usePrefetchStatusStream";
import { useRefreshConfigsAndPrefetch } from "@/hooks/useRefreshConfigsAndPrefetch";
import { useStableMergedConfigRows } from "@/hooks/useStableMergedConfigRows";
import { selectIsAuthed, selectSessionReady } from "@/store/auth/authSlice";
import {
  patchConfigItemActive,
  selectConfigsListError,
  selectConfigsListStatus,
  selectIsActiveTogglePending,
  selectIsConfigCardMutating,
  setConfigMutating,
} from "@/store/configs/configsSlice";
import {
  fetchConfigsList,
  patchConfigHashActive,
  refetchConfigHash,
} from "@/store/configs/configsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectMergedConfigRows } from "@/store/prefetchStatus/prefetchStatusSelectors";
import type { MergedConfigRow } from "@/types/configCard.types";
import { resetPrefetchStatusState } from "@/store/prefetchStatus/prefetchStatusSlice";
import {
  openAddConfigDialog,
  openConfigConfirmDialog,
  openEditConfigDialog,
  openLogDialog,
} from "@/store/ui/uiSlice";
import {
  buildConfigCardFormatters,
  buildConfigSourceCardStatusLabels,
} from "@/utils/configCardFormat.utils";
import { mapConfigHashOpsApiFailure } from "@/utils/configHashOpsError.utils";
import {
  formatActiveToggleSuccessMessage,
  formatRefetchConfigSuccessMessage,
} from "@/utils/configHashOpsSuccess.utils";

function ConfigSourceCardItem({
  row,
  baseLabels,
  interactionsDisabled,
  onViewLogs,
  onEdit,
  onDelete,
  onRefetch,
  onCancel,
  onActiveToggle,
}: Readonly<{
  row: MergedConfigRow;
  baseLabels: Omit<
    ConfigSourceCardLabels,
    "detailRows" | "prefetchWarningMessage" | "prefetchWarningAria"
  >;
  interactionsDisabled: boolean;
  onViewLogs: (hash: string) => void;
  onEdit: (hash: string) => void;
  onDelete: (hash: string) => void;
  onRefetch: (hash: string) => void;
  onCancel: (hash: string) => void;
  onActiveToggle: (hash: string, nextActive: boolean) => void;
}>) {
  const { t } = useTranslation();
  const cardPending = useAppSelector(selectIsConfigCardMutating(row.item.hash));
  const activeTogglePending = useAppSelector(selectIsActiveTogglePending(row.item.hash));

  const formatters = useMemo(() => buildConfigCardFormatters(t), [t]);

  const rowLabels = useMemo(
    () => ({
      ...baseLabels,
      labelInQueue:
        row.bandFields.band === "inQueue" && row.bandFields.queuePosition != null
          ? t("ConfigCard.Label_InQueueWithPosition", {
              position: row.bandFields.queuePosition,
            })
          : baseLabels.labelInQueue,
    }),
    [baseLabels, row.bandFields.band, row.bandFields.queuePosition, t],
  );

  const statusLabels = useMemo(
    () => buildConfigSourceCardStatusLabels(rowLabels, t),
    [rowLabels, t],
  );

  const showPrefetchWarning = shouldShowConfigCardPrefetchWarning(row);

  const labels = useMemo<ConfigSourceCardLabels>(
    () => ({
      ...rowLabels,
      detailRows: buildConfigCardDetailRows(row, rowLabels, formatters, statusLabels),
      prefetchWarningMessage: showPrefetchWarning
        ? t("ConfigCard.PrefetchWarning_Message")
        : undefined,
      prefetchWarningAria: t("ConfigCard.PrefetchWarning_Aria"),
    }),
    [formatters, row, rowLabels, showPrefetchWarning, statusLabels, t],
  );

  const statusDisplay = useMemo(
    () => buildConfigSourceCardStatusDisplay(row, statusLabels, formatters.formatTerminal),
    [formatters.formatTerminal, row, statusLabels],
  );
  const cta = buildConfigSourceCardCtaVisibility(row);
  const cardDisabled = interactionsDisabled || cardPending;

  return (
    <ConfigSourceCard
      row={row}
      labels={labels}
      statusPrimary={statusDisplay.primary}
      statusLastOutcome={statusDisplay.lastOutcomeLabel}
      statusLastOutcomeVariant={statusDisplay.lastOutcomeVariant}
      statusVariant={bandToStatusVariant(row.bandFields.band)}
      showRefetch={cta.showRefetch}
      showCancel={cta.showCancel}
      showLogs={cta.showLogs}
      interactionsDisabled={cardDisabled}
      pending={cardPending}
      activeTogglePending={activeTogglePending}
      onActiveToggle={() => onActiveToggle(row.item.hash, !row.item.isActive)}
      onRefetch={() => onRefetch(row.item.hash)}
      onCancel={() => onCancel(row.item.hash)}
      onViewLogs={() => onViewLogs(row.item.hash)}
      onEdit={() => onEdit(row.item.hash)}
      onDelete={() => onDelete(row.item.hash)}
    />
  );
}

export function ConfigPageContainer() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector(selectIsAuthed);
  const sessionReady = useAppSelector(selectSessionReady);
  const listStatus = useAppSelector(selectConfigsListStatus);
  const listError = useAppSelector(selectConfigsListError);
  const mergedRows = useAppSelector(selectMergedConfigRows);
  const stableRows = useStableMergedConfigRows(mergedRows);
  const [toast, setToast] = useState<ConfigPageToastState | null>(null);

  const refreshListAndPrefetch = useRefreshConfigsAndPrefetch();

  const showErrorToast = useCallback(
    (operation: "refetch" | "active", payload: { code: string; message: string }) => {
      setToast({
        message: mapConfigHashOpsApiFailure(operation, payload, t),
        severity: "error",
      });
    },
    [t],
  );

  const handleViewLogs = useCallback(
    (hash: string) => {
      dispatch(openLogDialog(hash));
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (hash: string) => {
      dispatch(openEditConfigDialog(hash));
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (hash: string) => {
      dispatch(openConfigConfirmDialog({ kind: "delete", hash }));
    },
    [dispatch],
  );

  const handleCancel = useCallback(
    (hash: string) => {
      dispatch(openConfigConfirmDialog({ kind: "cancel", hash }));
    },
    [dispatch],
  );

  const handleRefetch = useCallback(
    async (hash: string) => {
      dispatch(setConfigMutating({ hash, inFlight: true }));
      const result = await dispatch(refetchConfigHash(hash));
      dispatch(setConfigMutating({ hash, inFlight: false }));

      if (refetchConfigHash.fulfilled.match(result)) {
        void refreshListAndPrefetch();
        setToast({
          message: formatRefetchConfigSuccessMessage(result.payload, t),
          severity: "success",
        });
        return;
      }

      if (refetchConfigHash.rejected.match(result) && result.payload) {
        showErrorToast("refetch", result.payload);
      }
    },
    [dispatch, refreshListAndPrefetch, showErrorToast, t],
  );

  const handleActiveToggle = useCallback(
    async (hash: string, nextActive: boolean) => {
      dispatch(patchConfigItemActive({ hash, isActive: nextActive }));
      dispatch(setConfigMutating({ hash, inFlight: true, scope: "activeToggle" }));

      const startedAt = Date.now();
      const result = await dispatch(patchConfigHashActive({ hash, isActive: nextActive }));

      const remainingMs = ACTIVE_TOGGLE_MIN_LOADING_MS - (Date.now() - startedAt);
      if (remainingMs > 0) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, remainingMs);
        });
      }

      dispatch(setConfigMutating({ hash, inFlight: false }));

      if (patchConfigHashActive.fulfilled.match(result)) {
        dispatch(
          patchConfigItemActive({
            hash: result.payload.hash,
            isActive: result.payload.isActive,
          }),
        );
        void refreshListAndPrefetch();
        setToast({
          message: formatActiveToggleSuccessMessage(result.payload.isActive, t),
          severity: "success",
        });
        return;
      }

      dispatch(patchConfigItemActive({ hash, isActive: !nextActive }));

      if (patchConfigHashActive.rejected.match(result) && result.payload) {
        showErrorToast("active", result.payload);
      }
    },
    [dispatch, refreshListAndPrefetch, showErrorToast, t],
  );

  const fieldsDisabled = !isAuthed;
  const listLoading = listStatus === "loading" || listStatus === "idle";
  const showListSkeleton =
    !sessionReady || (sessionReady && isAuthed && listLoading && mergedRows.length === 0);
  const listRefreshing = listStatus === "loading" && mergedRows.length > 0;
  const listFailed = listStatus === "failed";
  const listBannerError =
    listStatus === "failed" ? (listError ?? t("Configs.Error_ListLoadFailed")) : null;

  const baseLabels = useMemo(
    (): Omit<
      ConfigSourceCardLabels,
      "detailRows" | "prefetchWarningMessage" | "prefetchWarningAria"
    > => ({
      activeSwitchAria: t("ConfigCard.AriaLabel_ActiveSwitch"),
      activeSwitchBusyAria: t("ConfigCard.AriaLabel_ActiveSwitchBusy"),
      badgeDirect: t("ConfigCard.Badge_Direct"),
      badgeXtream: t("ConfigCard.Badge_Xtream"),
      statusDetailsAria: t("ConfigCard.AriaLabel_StatusDetails"),
      statusDetailsTitle: t("ConfigCard.StatusDetails_Title"),
      statusTagAria: t("ConfigCard.AriaLabel_StatusTag"),
      lastOutcomeTagAria: t("ConfigCard.AriaLabel_LastOutcomeTag"),
      closeDetailsAria: t("Common.ButtonLabel_Close"),
      editAria: t("ConfigCard.AriaLabel_Edit"),
      deleteAria: t("ConfigCard.AriaLabel_Delete"),
      refetch: t("ConfigCard.ButtonLabel_Refetch"),
      cancel: t("ConfigCard.ButtonLabel_Cancel"),
      viewLogs: t("ConfigCard.ButtonLabel_ViewLogs"),
      syncing: t("ConfigCard.Label_Syncing"),
      labelRunning: t("ConfigCard.Label_Running"),
      labelFetching: t("ConfigCard.Label_Fetching"),
      labelInQueue: t("ConfigCard.Label_InQueue"),
      labelIdleReady: t("ConfigCard.Label_IdleReady"),
      labelLastOutcome: t("ConfigCard.Label_LastOutcome"),
      detailCurrentStatus: t("ConfigCard.Detail_CurrentStatus"),
      detailProgress: t("ConfigCard.Detail_Progress"),
      detailTriggered: t("ConfigCard.Detail_Triggered"),
      detailEstComplete: t("ConfigCard.Detail_EstComplete"),
      detailEstCompleteApprox: t("ConfigCard.Detail_EstCompleteApprox"),
      detailEstCompleteUnavailable: t("ConfigCard.Detail_EstCompleteUnavailable"),
      detailQueuePosition: t("ConfigCard.Detail_QueuePosition"),
      detailEstWait: t("ConfigCard.Detail_EstWait"),
      detailLastPrefetch: t("ConfigCard.Detail_LastPrefetch"),
      detailNextScheduled: t("ConfigCard.Detail_NextScheduled"),
      detailLastOutcome: t("ConfigCard.Detail_LastOutcome"),
      detailOutcomeDetail: t("ConfigCard.Detail_OutcomeDetail"),
    }),
    [t],
  );

  useEffect(() => {
    if (!sessionReady || !isAuthed) {
      return;
    }
    void dispatch(fetchConfigsList());
  }, [dispatch, isAuthed, sessionReady]);

  usePrefetchStatusStream(sessionReady && isAuthed && mergedRows.length > 0);

  useEffect(() => {
    return () => {
      dispatch(resetPrefetchStatusState());
    };
  }, [dispatch]);

  const renderConfigList = () => {
    if (showListSkeleton) {
      return <ConfigSourceListSkeleton />;
    }
    if (!isAuthed) {
      return (
        <ConfigListGrid>
          <ConfigListEmpty>{t("ConfigPage.Body_SignInRequired")}</ConfigListEmpty>
        </ConfigListGrid>
      );
    }
    if (stableRows.length === 0 && listStatus === "succeeded") {
      return (
        <ConfigListGrid>
          <ConfigListEmpty>{t("ConfigPage.Body_EmptySources")}</ConfigListEmpty>
        </ConfigListGrid>
      );
    }
    return (
      <ConfigListGrid aria-busy={listRefreshing || undefined}>
        {stableRows.map((row) => (
          <ConfigSourceCardItem
            key={row.item.hash}
            row={row}
            baseLabels={baseLabels}
            interactionsDisabled={fieldsDisabled}
            onViewLogs={handleViewLogs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefetch={handleRefetch}
            onCancel={handleCancel}
            onActiveToggle={handleActiveToggle}
          />
        ))}
      </ConfigListGrid>
    );
  };

  return (
    <Styled.PageContainer>
      <Stack component="main" aria-label={t("ConfigPage.AriaLabel_Main")}>
        <Styled.ConfigPanel>
          <Styled.PanelInner $gap="none">
            <Styled.PanelTitle>{t("ConfigPage.Panel_Title_Sources")}</Styled.PanelTitle>
            <Styled.PanelHint>{t("ConfigPage.Panel_Body_SourcesHint")}</Styled.PanelHint>
            <Styled.AddConfigButton
              disabled={fieldsDisabled}
              onClick={() => dispatch(openAddConfigDialog())}
            >
              {t("ConfigPage.ButtonLabel_AddConfiguration")}
            </Styled.AddConfigButton>

            {listFailed && listBannerError ? (
              <FeedbackBanner severity="error" role="alert">
                {listBannerError}
              </FeedbackBanner>
            ) : null}

            <Styled.ConfigListRegion aria-live="polite">
              {renderConfigList()}
            </Styled.ConfigListRegion>
          </Styled.PanelInner>
        </Styled.ConfigPanel>
      </Stack>
      <AddConfigDialogContainer />
      <EditConfigDialogContainer />
      <ConfigLogDialogContainer />
      <ConfigConfirmDialogContainer onToast={setToast} />
      <ToastSnackbar
        open={toast != null}
        autoHideDuration={6000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <ToastWell severity={toast.severity} onClose={() => setToast(null)}>
            {toast.message}
          </ToastWell>
        ) : (
          <span />
        )}
      </ToastSnackbar>
    </Styled.PageContainer>
  );
}
