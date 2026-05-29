"use client";

import { useCallback, useMemo, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Button, DialogShell } from "@/components/design-system";
import { Styled } from "@/containers/ConfigConfirmDialogContainer/ConfigConfirmDialogContainer.styled";
import {
  removeConfigItem,
  selectConfigByHash,
  setConfigMutating,
} from "@/store/configs/configsSlice";
import {
  cancelConfigHashSync,
  deleteConfig,
  fetchConfigsList,
} from "@/store/configs/configsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPrefetchStatus } from "@/store/prefetchStatus/prefetchStatusThunks";
import {
  closeConfigConfirmDialog,
  selectConfigConfirmHash,
  selectConfigConfirmKind,
  selectConfigConfirmOpen,
} from "@/store/ui/uiSlice";
import { mapConfigHashOpsApiFailure } from "@/utils/configHashOpsError.utils";
import {
  formatCancelConfigSuccessMessage,
  formatDeleteConfigSuccessMessage,
} from "@/utils/configHashOpsSuccess.utils";

export type ConfigPageToastState = Readonly<{
  message: string;
  severity: "success" | "error" | "info";
}>;

type ConfigConfirmDialogContainerProps = Readonly<{
  onToast: (toast: ConfigPageToastState) => void;
}>;

export function ConfigConfirmDialogContainer({ onToast }: ConfigConfirmDialogContainerProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectConfigConfirmOpen);
  const kind = useAppSelector(selectConfigConfirmKind);
  const hash = useAppSelector(selectConfigConfirmHash);
  const listItem = useAppSelector(hash ? selectConfigByHash(hash) : () => undefined);
  const [confirming, setConfirming] = useState(false);

  const configName = listItem?.configName ?? "";

  const copy = useMemo(() => {
    if (kind === "delete") {
      return {
        title: t("ConfigConfirm.Dialog_Title_Delete"),
        body: t("ConfigConfirm.Dialog_Body_Delete", { name: configName }),
        dismiss: t("ConfigConfirm.ButtonLabel_KeepSource"),
        confirm: t("ConfigConfirm.ButtonLabel_RemoveSource"),
        confirmDanger: true,
      };
    }
    if (kind === "cancel") {
      return {
        title: t("ConfigConfirm.Dialog_Title_CancelSync"),
        body: t("ConfigConfirm.Dialog_Body_CancelSync", { name: configName }),
        dismiss: t("ConfigConfirm.ButtonLabel_KeepUpdating"),
        confirm: t("ConfigConfirm.ButtonLabel_CancelUpdate"),
        confirmDanger: false,
      };
    }
    return null;
  }, [configName, kind, t]);

  const refreshListAndPrefetch = useCallback(async () => {
    await Promise.all([dispatch(fetchConfigsList()), dispatch(fetchPrefetchStatus())]);
  }, [dispatch]);

  const handleDismiss = useCallback(() => {
    if (confirming) {
      return;
    }
    dispatch(closeConfigConfirmDialog());
  }, [confirming, dispatch]);

  const handleConfirm = useCallback(async () => {
    if (!hash || !kind || confirming) {
      return;
    }

    dispatch(closeConfigConfirmDialog());
    dispatch(setConfigMutating({ hash, inFlight: true }));
    setConfirming(true);

    if (kind === "delete") {
      const result = await dispatch(deleteConfig(hash));
      setConfirming(false);
      dispatch(setConfigMutating({ hash, inFlight: false }));

      if (deleteConfig.fulfilled.match(result)) {
        dispatch(removeConfigItem(hash));
        void refreshListAndPrefetch();
        onToast({
          message: formatDeleteConfigSuccessMessage(result.payload, t),
          severity: "success",
        });
        return;
      }

      if (deleteConfig.rejected.match(result) && result.payload) {
        onToast({
          message: mapConfigHashOpsApiFailure("delete", result.payload, t),
          severity: "error",
        });
      }
      return;
    }

    const result = await dispatch(cancelConfigHashSync(hash));
    setConfirming(false);
    dispatch(setConfigMutating({ hash, inFlight: false }));

    if (cancelConfigHashSync.fulfilled.match(result)) {
      void refreshListAndPrefetch();
      onToast({
        message: formatCancelConfigSuccessMessage(result.payload, t),
        severity: "success",
      });
      return;
    }

    if (cancelConfigHashSync.rejected.match(result) && result.payload) {
      onToast({
        message: mapConfigHashOpsApiFailure("cancel", result.payload, t),
        severity: "error",
      });
    }
  }, [confirming, dispatch, hash, kind, onToast, refreshListAndPrefetch, t]);

  if (!copy) {
    return null;
  }

  return (
    <DialogShell
      open={open}
      onClose={handleDismiss}
      onDismiss={handleDismiss}
      closeAriaLabel={t("Common.ButtonLabel_Close")}
      fullWidth
      title={copy.title}
      hideFooterSeparator
      hideHeaderSeparator
      footer={
        <Styled.ActionsRow>
          <Button type="button" appearance="secondary" disabled={confirming} onClick={handleDismiss}>
            {copy.dismiss}
          </Button>
          <Button
            type="button"
            appearance={copy.confirmDanger ? "danger" : "primary"}
            disabled={confirming}
            onClick={() => void handleConfirm()}
          >
            {copy.confirm}
          </Button>
        </Styled.ActionsRow>
      }
    >
      <Typography variant="body2" color="text.secondary">
        {copy.body}
      </Typography>
    </DialogShell>
  );
}
