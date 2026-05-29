"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  FeedbackBanner,
  FieldPassword,
  SkeletonBlock,
  ToastSnackbar,
  ToastWell,
} from "@/components/design-system";
import { Styled } from "@/containers/InstallPageContainer/InstallPageContainer.styled";
import { selectIsAuthed, selectSessionReady, selectUserId } from "@/store/auth/authSlice";
import {
  selectChangePasswordStatus,
  selectManifestError,
  selectManifestStatus,
  selectManifestUrl,
  selectStremioWebInstallUrl,
} from "@/store/install/installSlice";
import { changePassword, fetchStremioManifestUrl } from "@/store/install/installThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { mapChangePasswordApiFailure } from "@/utils/changePasswordError.utils";
import {
  createChangePasswordFormSchema,
  type ChangePasswordFormValues,
} from "@/validation/changePassword.validation";

type ToastState = Readonly<{
  message: string;
  severity: "success" | "error" | "info";
}>;

export function InstallPageContainer() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);
  const isAuthed = useAppSelector(selectIsAuthed);
  const sessionReady = useAppSelector(selectSessionReady);
  const manifestUrl = useAppSelector(selectManifestUrl);
  const stremioWebInstallUrl = useAppSelector(selectStremioWebInstallUrl);
  const manifestStatus = useAppSelector(selectManifestStatus);
  const manifestError = useAppSelector(selectManifestError);
  const changePasswordStatus = useAppSelector(selectChangePasswordStatus);

  const [toast, setToast] = useState<ToastState | null>(null);

  const accountIdDisplay = userId ?? "—";
  const fieldsDisabled = !isAuthed;
  const isChangingPassword = changePasswordStatus === "loading";
  const isManifestLoading = manifestStatus === "loading";
  const stremioActionsDisabled =
    fieldsDisabled ||
    isManifestLoading ||
    manifestStatus === "failed" ||
    !manifestUrl ||
    !stremioWebInstallUrl;

  const changePasswordSchema = useMemo(() => createChangePasswordFormSchema(t), [t]);

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      confirmNewPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const passwordToggleAriaLabel = {
    show: t("Common.FieldPassword_AriaLabel_Show"),
    hide: t("Common.FieldPassword_AriaLabel_Hide"),
  };

  const formError = passwordForm.formState.errors.root?.message ?? null;

  useEffect(() => {
    if (!sessionReady || !isAuthed) {
      return;
    }
    void dispatch(fetchStremioManifestUrl());
  }, [dispatch, isAuthed, sessionReady]);

  const applyMappedError = (mapped: ReturnType<typeof mapChangePasswordApiFailure>) => {
    if (mapped.field === "form") {
      passwordForm.setError("root", { message: mapped.message });
      return;
    }
    passwordForm.setError(mapped.field, { message: mapped.message });
  };

  const handleChangePasswordSubmit = passwordForm.handleSubmit(async (values) => {
    passwordForm.clearErrors("root");
    const result = await dispatch(changePassword(values));
    if (changePassword.fulfilled.match(result)) {
      passwordForm.reset({
        confirmNewPassword: "",
        currentPassword: "",
        newPassword: "",
      });
      setToast({
        message: t("InstallPage.Toast_PasswordUpdated"),
        severity: "success",
      });
      return;
    }
    if (changePassword.rejected.match(result)) {
      const payload = result.payload;
      if (payload) {
        applyMappedError(mapChangePasswordApiFailure(payload, t));
      }
    }
  });

  const handleCopyAccountId = async () => {
    if (!userId) {
      return;
    }
    try {
      await navigator.clipboard.writeText(userId);
      setToast({
        message: t("InstallPage.Toast_CopiedToClipboard"),
        severity: "success",
      });
    } catch {
      // Clipboard may be unavailable — user can still select the code block.
    }
  };

  const handleCopyManifestUrl = async () => {
    if (!manifestUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(manifestUrl);
      setToast({
        message: t("InstallPage.Toast_CopiedToClipboard"),
        severity: "success",
      });
    } catch {
      setToast({
        message: manifestUrl,
        severity: "info",
      });
    }
  };

  const handleInstallStremioWeb = () => {
    if (!stremioWebInstallUrl) {
      return;
    }
    window.open(stremioWebInstallUrl, "_blank", "noopener");
  };

  return (
    <>
      <Styled.PageContainer>
        <Stack spacing={3} component="main" aria-label={t("InstallPage.AriaLabel_Main")}>
          <Styled.PagePanel aria-busy={!sessionReady}>
            {!sessionReady ? (
              <SkeletonBlock />
            ) : (
              <Styled.PanelInner $gap="none">
                <Styled.PanelTitle>{t("InstallPage.Panel_Title_Account")}</Styled.PanelTitle>
                <Styled.AccountIdRow role="group" aria-label={t("InstallPage.AriaLabel_AccountId")}>
                  <Styled.AccountIdLabel>
                    {t("InstallPage.Panel_Body_AccountId")}
                  </Styled.AccountIdLabel>
                  <Styled.AccountIdValueWrap>
                    <Styled.AccountIdCode title={userId ?? undefined}>
                      {accountIdDisplay}
                    </Styled.AccountIdCode>
                    {userId ? (
                      <Styled.CopyAccountIdButton
                        type="button"
                        aria-label={t("InstallPage.ButtonLabel_CopyAccountId")}
                        onClick={() => void handleCopyAccountId()}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </Styled.CopyAccountIdButton>
                    ) : null}
                  </Styled.AccountIdValueWrap>
                </Styled.AccountIdRow>
              </Styled.PanelInner>
            )}
          </Styled.PagePanel>

          <Styled.PagePanel
            component="section"
            aria-label={t("InstallPage.Panel_AriaLabel_ChangePassword")}
          >
            <Styled.PanelInner $gap="none">
              <Styled.PanelTitle>{t("InstallPage.Panel_Title_ChangePassword")}</Styled.PanelTitle>
              <Styled.PanelHint>{t("InstallPage.Panel_Body_ChangePasswordHint")}</Styled.PanelHint>
              {formError ? (
                <FeedbackBanner severity="error" role="alert">
                  {formError}
                </FeedbackBanner>
              ) : null}
              <Styled.FieldStackForm
                id="install-change-password-form"
                noValidate
                onSubmit={handleChangePasswordSubmit}
              >
                <FieldPassword
                  label={t("InstallPage.FieldLabel_CurrentPassword")}
                  autoComplete="current-password"
                  disabled={fieldsDisabled || isChangingPassword}
                  error={Boolean(passwordForm.formState.errors.currentPassword)}
                  helperText={passwordForm.formState.errors.currentPassword?.message}
                  visibilityToggleAriaLabel={passwordToggleAriaLabel}
                  {...passwordForm.register("currentPassword")}
                />
                <FieldPassword
                  label={t("InstallPage.FieldLabel_NewPassword")}
                  autoComplete="new-password"
                  disabled={fieldsDisabled || isChangingPassword}
                  error={Boolean(passwordForm.formState.errors.newPassword)}
                  helperText={passwordForm.formState.errors.newPassword?.message}
                  visibilityToggleAriaLabel={passwordToggleAriaLabel}
                  {...passwordForm.register("newPassword")}
                />
                <FieldPassword
                  label={t("InstallPage.FieldLabel_ConfirmNewPassword")}
                  autoComplete="new-password"
                  disabled={fieldsDisabled || isChangingPassword}
                  error={Boolean(passwordForm.formState.errors.confirmNewPassword)}
                  helperText={passwordForm.formState.errors.confirmNewPassword?.message}
                  visibilityToggleAriaLabel={passwordToggleAriaLabel}
                  {...passwordForm.register("confirmNewPassword")}
                />
              </Styled.FieldStackForm>
              <Styled.UpdatePasswordButton
                type="submit"
                form="install-change-password-form"
                appearance="secondary"
                disabled={fieldsDisabled || isChangingPassword}
              >
                {isChangingPassword
                  ? t("InstallPage.ButtonLabel_UpdatePassword_Loading")
                  : t("InstallPage.ButtonLabel_UpdatePassword")}
              </Styled.UpdatePasswordButton>
            </Styled.PanelInner>
          </Styled.PagePanel>

          <Styled.PagePanel
            component="section"
            aria-label={t("InstallPage.Panel_AriaLabel_Stremio")}
            aria-busy={isAuthed && isManifestLoading}
          >
            <Styled.PanelInner $gap="none">
              <Styled.PanelTitle>{t("InstallPage.Panel_Title_Stremio")}</Styled.PanelTitle>
              <Styled.PanelHint>{t("InstallPage.Panel_Body_StremioHint")}</Styled.PanelHint>
              {isAuthed && manifestStatus === "failed" && manifestError ? (
                <FeedbackBanner severity="error" role="alert">
                  {manifestError || t("InstallPage.Error_ManifestLoadFailed")}
                </FeedbackBanner>
              ) : null}
              {isAuthed && isManifestLoading ? <SkeletonBlock /> : null}
              <Styled.StremioActions
                role="group"
                aria-label={t("InstallPage.Panel_AriaLabel_Stremio")}
              >
                <Button
                  type="button"
                  appearance="secondary"
                  disabled={stremioActionsDisabled}
                  onClick={() => void handleCopyManifestUrl()}
                >
                  {t("InstallPage.ButtonLabel_CopyManifestUrl")}
                </Button>
                <Styled.StremioOrLabel>{t("InstallPage.Text_Or")}</Styled.StremioOrLabel>
                <Button
                  type="button"
                  disabled={stremioActionsDisabled}
                  onClick={handleInstallStremioWeb}
                >
                  {t("InstallPage.ButtonLabel_InstallStremioWeb")}
                </Button>
              </Styled.StremioActions>
            </Styled.PanelInner>
          </Styled.PagePanel>
        </Stack>
      </Styled.PageContainer>

      <ToastSnackbar
        open={toast !== null}
        autoHideDuration={4000}
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
