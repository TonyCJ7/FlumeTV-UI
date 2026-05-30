"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Collapse, Stack } from "@mui/material";
import { useDialogFullScreen } from "@/hooks/useLayoutMode";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  CheckField,
  DialogShell,
  FeedbackBanner,
  FieldPassword,
  FieldText,
  RadioField,
  SegmentTabs,
  ToastSnackbar,
  ToastWell,
} from "@/components/design-system";
import { Styled } from "@/containers/AddConfigDialogContainer/AddConfigDialogContainer.styled";
import { REST_ERROR_CODES } from "@/constants/restError.constants";
import { layoutTokens } from "@/theme/tokens";
import type { PostConfigRequestBody } from "@/types/rest.types";
import { createConfig, fetchConfigsList } from "@/store/configs/configsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeAddConfigDialog,
  selectAddConfigDialogOpen,
  selectAddConfigTab,
  setAddConfigTab,
  type AddConfigTab,
} from "@/store/ui/uiSlice";
import { mapAddConfigApiFailure } from "@/utils/addConfigError.utils";
import { formatAddConfigSuccessMessage } from "@/utils/addConfigSuccess.utils";
import { toPostConfigDirectRequestBody, toPostConfigXtreamRequestBody } from "@/utils/config.utils";
import {
  createAddConfigDirectFormSchema,
  createAddConfigXtreamFormSchema,
  type AddConfigDirectFormValues,
  type AddConfigXtreamFormValues,
} from "@/validation/config.validation";

const DIRECT_DEFAULTS: AddConfigDirectFormValues = {
  configName: "",
  m3uUrl: "",
  hasCustomEpg: false,
  epgUrl: "",
  epgOffset: "",
};

const XTREAM_DEFAULTS: AddConfigXtreamFormValues = {
  configName: "",
  panelUrl: "",
  panelUsername: "",
  panelPassword: "",
  hasCustomEpg: true,
  epgSource: "panel",
  customEpgUrl: "",
  epgUrl: "",
  epgOffset: "",
};

type ToastState = Readonly<{
  message: string;
  severity: "success" | "error";
}>;

function EpgFieldset({
  legend,
  epgEnabled,
  children,
}: Readonly<{ legend: string; epgEnabled: boolean; children: ReactNode }>) {
  return (
    <Styled.EpgFieldset>
      <Styled.EpgLegend>{legend}</Styled.EpgLegend>
      <Stack spacing={epgEnabled ? 3 : 0}>{children}</Stack>
    </Styled.EpgFieldset>
  );
}

export function AddConfigDialogContainer() {
  const { t } = useTranslation();
  const isMobile = useDialogFullScreen();
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectAddConfigDialogOpen);
  const tab = useAppSelector(selectAddConfigTab);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [providerConflictMessage, setProviderConflictMessage] = useState<string | null>(null);

  const directPanelId = useId();
  const xtreamPanelId = useId();

  const directSchema = useMemo(() => createAddConfigDirectFormSchema(t), [t]);
  const xtreamSchema = useMemo(() => createAddConfigXtreamFormSchema(t), [t]);

  const directForm = useForm<AddConfigDirectFormValues>({
    resolver: zodResolver(directSchema),
    defaultValues: DIRECT_DEFAULTS,
    mode: "onChange",
  });

  const xtreamForm = useForm<AddConfigXtreamFormValues>({
    resolver: zodResolver(xtreamSchema),
    defaultValues: XTREAM_DEFAULTS,
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

  const segmentTabs = [
    { id: "direct", label: t("AddConfig.Tab_Direct") },
    { id: "xtream", label: t("AddConfig.Tab_Xtream") },
  ];

  const resetForms = () => {
    directForm.reset(DIRECT_DEFAULTS);
    xtreamForm.reset(XTREAM_DEFAULTS);
    setProviderConflictMessage(null);
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }
    dispatch(closeAddConfigDialog());
    resetForms();
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const focusTimer = window.setTimeout(() => {
      if (tab === "direct") {
        directForm.setFocus("configName");
      } else {
        xtreamForm.setFocus("configName");
      }
    }, 0);
    return () => window.clearTimeout(focusTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focus when dialog opens or tab changes
  }, [open, tab]);

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

  const handleTabChange = (nextTab: string) => {
    setProviderConflictMessage(null);
    dispatch(setAddConfigTab(nextTab as AddConfigTab));
  };

  const runCreate = async (body: PostConfigRequestBody) => {
    setSubmitting(true);
    setProviderConflictMessage(null);
    const result = await dispatch(createConfig(body));
    setSubmitting(false);

    if (createConfig.fulfilled.match(result)) {
      dispatch(closeAddConfigDialog());
      resetForms();
      void dispatch(fetchConfigsList());
      setToast({
        message: formatAddConfigSuccessMessage(result.payload, t),
        severity: "success",
      });
      return;
    }

    if (createConfig.rejected.match(result) && result.payload) {
      const message = mapAddConfigApiFailure(result.payload, t);

      if (result.payload.code === REST_ERROR_CODES.CONFIG_ALREADY_EXISTS) {
        setProviderConflictMessage(message);
        return;
      }

      setToast({
        message,
        severity: "error",
      });
    }
  };

  const handleDirectSubmit = directForm.handleSubmit(async (values) => {
    await runCreate(toPostConfigDirectRequestBody(values));
  });

  const handleXtreamSubmit = xtreamForm.handleSubmit(async (values) => {
    await runCreate(toPostConfigXtreamRequestBody(values));
  });

  const handleFooterSubmit = () => {
    if (tab === "direct") {
      void handleDirectSubmit();
    } else {
      void handleXtreamSubmit();
    }
  };

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
        title={t("AddConfig.Dialog_Title")}
        footer={
          <Styled.FooterWrap>
            <Styled.PrimarySubmit type="button" disabled={submitting} onClick={handleFooterSubmit}>
              {submitting
                ? t("AddConfig.ButtonLabel_Submit_Loading")
                : t("AddConfig.ButtonLabel_Submit")}
            </Styled.PrimarySubmit>
          </Styled.FooterWrap>
        }
      >
        <Styled.ScrollBody>
          <Stack spacing={3}>
            <SegmentTabs
              tabs={segmentTabs}
              value={tab}
              onChange={handleTabChange}
              aria-label={t("AddConfig.Segment_AriaLabel_Type")}
            />

            {providerConflictMessage ? (
              <FeedbackBanner severity="error" role="alert">
                {providerConflictMessage}
              </FeedbackBanner>
            ) : null}

            <Styled.TabPanel role="tabpanel" id={directPanelId} hidden={tab !== "direct"}>
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
            </Styled.TabPanel>

            <Styled.TabPanel role="tabpanel" id={xtreamPanelId} hidden={tab !== "xtream"}>
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
                  helperText={xtreamForm.formState.errors.panelPassword?.message}
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
                        name="add-xtream-epg-source"
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
            </Styled.TabPanel>
          </Stack>
        </Styled.ScrollBody>
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
