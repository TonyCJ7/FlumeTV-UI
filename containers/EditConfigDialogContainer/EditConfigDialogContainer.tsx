"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Collapse, Stack } from "@mui/material";
import { useDialogFullScreen } from "@/hooks/useLayoutMode";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  CheckField,
  DialogShell,
  FieldPassword,
  FieldText,
  RadioField,
  ToastSnackbar,
  ToastWell,
} from "@/components/design-system";
import { SourceTypeBadge } from "@/components/core/SourceTypeBadge";
import { Styled as AddConfigStyled } from "@/containers/AddConfigDialogContainer/AddConfigDialogContainer.styled";
import { Styled } from "@/containers/EditConfigDialogContainer/EditConfigDialogContainer.styled";
import type { PostConfigRequestBody } from "@/types/rest.types";
import {
  migrateConfigItemHash,
  patchConfigItemConfigName,
  selectConfigByHash,
  setConfigMutating,
} from "@/store/configs/configsSlice";
import { fetchConfigsList, updateConfig } from "@/store/configs/configsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeEditConfigDialog,
  selectEditConfigDialogOpen,
  selectEditConfigHash,
} from "@/store/ui/uiSlice";
import {
  classifyPutConfigResponse,
  configListItemToDirectFormValues,
  configListItemToXtreamFormValues,
  toPostConfigDirectRequestBody,
  toPostConfigXtreamRequestBody,
} from "@/utils/config.utils";
import { mapEditConfigApiFailure } from "@/utils/editConfigError.utils";
import { formatEditConfigSuccessMessage } from "@/utils/editConfigSuccess.utils";
import {
  createAddConfigDirectFormSchema,
  createAddConfigXtreamFormSchema,
  type AddConfigDirectFormValues,
  type AddConfigXtreamFormValues,
} from "@/validation/config.validation";

type ToastState = Readonly<{
  message: string;
  severity: "success" | "error" | "info";
}>;

function EpgFieldset({
  legend,
  epgEnabled,
  children,
}: Readonly<{ legend: string; epgEnabled: boolean; children: ReactNode }>) {
  return (
    <AddConfigStyled.EpgFieldset>
      <AddConfigStyled.EpgLegend>{legend}</AddConfigStyled.EpgLegend>
      <Stack spacing={epgEnabled ? 3 : 0}>{children}</Stack>
    </AddConfigStyled.EpgFieldset>
  );
}

export function EditConfigDialogContainer() {
  const { t } = useTranslation();
  const isMobile = useDialogFullScreen();
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectEditConfigDialogOpen);
  const editHash = useAppSelector(selectEditConfigHash);
  const listItem = useAppSelector(editHash ? selectConfigByHash(editHash) : () => undefined);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const directSchema = useMemo(() => createAddConfigDirectFormSchema(t), [t]);
  const xtreamSchema = useMemo(() => createAddConfigXtreamFormSchema(t), [t]);

  const directForm = useForm<AddConfigDirectFormValues>({
    resolver: zodResolver(directSchema),
    defaultValues: {
      configName: "",
      m3uUrl: "",
      hasCustomEpg: true,
      epgUrl: "",
      epgOffset: "",
    },
    mode: "onChange",
  });

  const xtreamForm = useForm<AddConfigXtreamFormValues>({
    resolver: zodResolver(xtreamSchema),
    defaultValues: {
      configName: "",
      panelUrl: "",
      panelUsername: "",
      panelPassword: "",
      hasCustomEpg: true,
      epgSource: "panel",
      customEpgUrl: "",
      epgUrl: "",
      epgOffset: "",
    },
    mode: "onChange",
  });

  const directEpgEnabled = useWatch({
    control: directForm.control,
    name: "hasCustomEpg",
  });
  const xtreamEpgEnabled = useWatch({
    control: xtreamForm.control,
    name: "hasCustomEpg",
  });
  const xtreamEpgSource = useWatch({
    control: xtreamForm.control,
    name: "epgSource",
  });

  const passwordToggleAriaLabel = {
    show: t("Common.FieldPassword_AriaLabel_Show"),
    hide: t("Common.FieldPassword_AriaLabel_Hide"),
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }
    dispatch(closeEditConfigDialog());
  };

  useEffect(() => {
    if (open && editHash && !listItem) {
      dispatch(closeEditConfigDialog());
    }
  }, [dispatch, editHash, listItem, open]);

  useEffect(() => {
    if (!open || !listItem) {
      return;
    }

    if (listItem.type === "direct") {
      directForm.reset(configListItemToDirectFormValues(listItem));
    } else {
      xtreamForm.reset(configListItemToXtreamFormValues(listItem));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefill when dialog opens for this hash
  }, [open, listItem?.hash, listItem?.type]);

  useEffect(() => {
    if (!open || !listItem) {
      return;
    }
    const focusTimer = window.setTimeout(() => {
      if (listItem.type === "direct") {
        directForm.setFocus("configName");
      } else {
        xtreamForm.setFocus("configName");
      }
    }, 0);
    return () => window.clearTimeout(focusTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focus when dialog opens
  }, [open, listItem?.hash, listItem?.type]);

  useEffect(() => {
    if (!directEpgEnabled) {
      directForm.clearErrors(["epgUrl", "epgOffset"]);
    }
  }, [directEpgEnabled, directForm]);

  useEffect(() => {
    if (!xtreamEpgEnabled) {
      xtreamForm.clearErrors(["customEpgUrl", "epgOffset"]);
      return;
    }
    if (xtreamEpgSource !== "custom") {
      xtreamForm.clearErrors("customEpgUrl");
    }
  }, [xtreamEpgEnabled, xtreamEpgSource, xtreamForm]);

  const runUpdate = async (body: PostConfigRequestBody) => {
    if (!editHash) {
      return;
    }

    dispatch(setConfigMutating({ hash: editHash, inFlight: true }));
    setSubmitting(true);
    const result = await dispatch(updateConfig({ hash: editHash, body }));
    setSubmitting(false);
    dispatch(setConfigMutating({ hash: editHash, inFlight: false }));

    if (updateConfig.fulfilled.match(result)) {
      const { requestHash, configName, response } = result.payload;

      const outcome = classifyPutConfigResponse(response);

      if (outcome === "unchanged") {
        dispatch(closeEditConfigDialog());
        setToast({
          message: formatEditConfigSuccessMessage(response, t) ?? "",
          severity: "info",
        });
        return;
      }

      if (outcome === "nameOnly") {
        dispatch(
          patchConfigItemConfigName({
            hash: response.hash,
            configName,
          }),
        );
        dispatch(closeEditConfigDialog());
        setToast({
          message: formatEditConfigSuccessMessage(response, t) ?? "",
          severity: "success",
        });
        return;
      }

      if (outcome === "hashTransition") {
        if (response.hash !== requestHash) {
          dispatch(
            migrateConfigItemHash({
              oldHash: requestHash,
              newHash: response.hash,
            }),
          );
        }
        void dispatch(fetchConfigsList());
        dispatch(closeEditConfigDialog());
        setToast({
          message: formatEditConfigSuccessMessage(response, t) ?? "",
          severity: "success",
        });
        return;
      }

      dispatch(closeEditConfigDialog());
      setToast({
        message: formatEditConfigSuccessMessage(response, t) ?? "",
        severity: "success",
      });
      return;
    }

    if (updateConfig.rejected.match(result) && result.payload) {
      setToast({
        message: mapEditConfigApiFailure(result.payload, t),
        severity: "error",
      });
    }
  };

  const handleDirectSubmit = directForm.handleSubmit(async (values) => {
    await runUpdate(toPostConfigDirectRequestBody(values));
  });

  const handleXtreamSubmit = xtreamForm.handleSubmit(async (values) => {
    await runUpdate(toPostConfigXtreamRequestBody(values));
  });

  const handleFooterSubmit = () => {
    if (!listItem) {
      return;
    }
    if (listItem.type === "direct") {
      void handleDirectSubmit();
    } else {
      void handleXtreamSubmit();
    }
  };

  if (!listItem) {
    return null;
  }

  const typeBadgeLabel =
    listItem.type === "direct" ? t("ConfigCard.Badge_Direct") : t("ConfigCard.Badge_Xtream");

  return (
    <>
      <DialogShell
        open={open}
        fullScreen={isMobile}
        fullWidth
        onClose={(_event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            handleClose();
          }
        }}
        onDismiss={handleClose}
        closeAriaLabel={t("Common.ButtonLabel_Close")}
        title={
          <Styled.TitleRow>
            {t("EditConfig.Dialog_Title")}
            <SourceTypeBadge kind={listItem.type} label={typeBadgeLabel} />
          </Styled.TitleRow>
        }
        footer={
          <AddConfigStyled.FooterWrap>
            <Styled.PrimarySubmit type="button" disabled={submitting} onClick={handleFooterSubmit}>
              {submitting
                ? t("EditConfig.ButtonLabel_Submit_Loading")
                : t("EditConfig.ButtonLabel_Submit")}
            </Styled.PrimarySubmit>
          </AddConfigStyled.FooterWrap>
        }
      >
        <AddConfigStyled.ScrollBody>
          <Styled.FieldStack spacing={3}>
            {listItem.type === "direct" ? (
              <Stack spacing={3} component="form" noValidate onSubmit={handleDirectSubmit}>
                <FieldText
                  label={t("ConfigForm.FieldLabel_ConfigName")}
                  autoComplete="off"
                  disabled={submitting}
                  error={Boolean(directForm.formState.errors.configName)}
                  helperText={directForm.formState.errors.configName?.message}
                  {...directForm.register("configName")}
                />
                <FieldText
                  label={t("AddConfig.FieldLabel_M3uUrl")}
                  autoComplete="off"
                  disabled={submitting}
                  error={Boolean(directForm.formState.errors.m3uUrl)}
                  helperText={directForm.formState.errors.m3uUrl?.message}
                  {...directForm.register("m3uUrl")}
                />
                <EpgFieldset legend={t("AddConfig.Fieldset_Epg")} epgEnabled={directEpgEnabled}>
                  <CheckField
                    label={t("AddConfig.FieldLabel_EnableEpg")}
                    checked={directEpgEnabled}
                    disabled={submitting}
                    onChange={(checked) =>
                      directForm.setValue("hasCustomEpg", checked, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                  <Collapse in={directEpgEnabled}>
                    <Stack spacing={3}>
                      <FieldText
                        label={t("AddConfig.FieldLabel_EpgUrl")}
                        autoComplete="off"
                        disabled={submitting || !directEpgEnabled}
                        error={Boolean(directForm.formState.errors.epgUrl)}
                        helperText={directForm.formState.errors.epgUrl?.message}
                        {...directForm.register("epgUrl")}
                      />
                      <FieldText
                        label={t("AddConfig.FieldLabel_EpgOffset")}
                        autoComplete="off"
                        disabled={submitting || !directEpgEnabled}
                        error={Boolean(directForm.formState.errors.epgOffset)}
                        helperText={directForm.formState.errors.epgOffset?.message}
                        inputMode="decimal"
                        {...directForm.register("epgOffset")}
                      />
                    </Stack>
                  </Collapse>
                </EpgFieldset>
              </Stack>
            ) : (
              <Stack spacing={3} component="form" noValidate onSubmit={handleXtreamSubmit}>
                <FieldText
                  label={t("ConfigForm.FieldLabel_ConfigName")}
                  autoComplete="off"
                  disabled={submitting}
                  error={Boolean(xtreamForm.formState.errors.configName)}
                  helperText={xtreamForm.formState.errors.configName?.message}
                  {...xtreamForm.register("configName")}
                />
                <FieldText
                  label={t("AddConfig.FieldLabel_PanelUrl")}
                  autoComplete="off"
                  disabled={submitting}
                  error={Boolean(xtreamForm.formState.errors.panelUrl)}
                  helperText={xtreamForm.formState.errors.panelUrl?.message}
                  {...xtreamForm.register("panelUrl")}
                />
                <FieldText
                  label={t("AddConfig.FieldLabel_PanelUsername")}
                  autoComplete="username"
                  disabled={submitting}
                  error={Boolean(xtreamForm.formState.errors.panelUsername)}
                  helperText={xtreamForm.formState.errors.panelUsername?.message}
                  {...xtreamForm.register("panelUsername")}
                />
                <FieldPassword
                  label={t("AddConfig.FieldLabel_PanelPassword")}
                  autoComplete="current-password"
                  disabled={submitting}
                  error={Boolean(xtreamForm.formState.errors.panelPassword)}
                  helperText={
                    xtreamForm.formState.errors.panelPassword?.message ??
                    t("EditConfig.FieldHint_PanelPassword")
                  }
                  visibilityToggleAriaLabel={passwordToggleAriaLabel}
                  {...xtreamForm.register("panelPassword")}
                />
                <EpgFieldset legend={t("AddConfig.Fieldset_Epg")} epgEnabled={xtreamEpgEnabled}>
                  <CheckField
                    label={t("AddConfig.FieldLabel_EnableEpg")}
                    checked={xtreamEpgEnabled}
                    disabled={submitting}
                    onChange={(checked) =>
                      xtreamForm.setValue("hasCustomEpg", checked, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                  <Collapse in={xtreamEpgEnabled}>
                    <Stack spacing={3}>
                      <RadioField
                        name="edit-xtream-epg-source"
                        label={t("AddConfig.FieldLabel_EpgSource")}
                        value={xtreamEpgSource}
                        onChange={(value) =>
                          xtreamForm.setValue(
                            "epgSource",
                            value as AddConfigXtreamFormValues["epgSource"],
                            { shouldDirty: true, shouldValidate: true },
                          )
                        }
                        options={[
                          {
                            value: "panel",
                            label: t("AddConfig.EpgSource_Panel"),
                          },
                          {
                            value: "custom",
                            label: t("AddConfig.EpgSource_Custom"),
                          },
                        ]}
                      />
                      {xtreamEpgSource === "custom" ? (
                        <FieldText
                          label={t("AddConfig.FieldLabel_CustomEpgUrl")}
                          autoComplete="off"
                          disabled={submitting || !xtreamEpgEnabled}
                          error={Boolean(xtreamForm.formState.errors.customEpgUrl)}
                          helperText={xtreamForm.formState.errors.customEpgUrl?.message}
                          {...xtreamForm.register("customEpgUrl")}
                        />
                      ) : null}
                      <FieldText
                        label={t("AddConfig.FieldLabel_EpgOffset")}
                        autoComplete="off"
                        disabled={submitting || !xtreamEpgEnabled}
                        error={Boolean(xtreamForm.formState.errors.epgOffset)}
                        helperText={xtreamForm.formState.errors.epgOffset?.message}
                        inputMode="decimal"
                        {...xtreamForm.register("epgOffset")}
                      />
                    </Stack>
                  </Collapse>
                </EpgFieldset>
              </Stack>
            )}
          </Styled.FieldStack>
        </AddConfigStyled.ScrollBody>
      </DialogShell>

      <ToastSnackbar
        open={toast !== null}
        autoHideDuration={6000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <ToastWell
            severity={toast.severity}
            onClose={() => setToast(null)}
            role={toast.severity === "error" ? "alert" : "status"}
          >
            {toast.message}
          </ToastWell>
        ) : undefined}
      </ToastSnackbar>
    </>
  );
}
