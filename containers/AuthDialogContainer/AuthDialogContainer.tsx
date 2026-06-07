"use client";

import { useEffect, useId, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Button,
  DialogShell,
  FeedbackBanner,
  FieldPassword,
  FieldText,
  SegmentTabs,
} from "@/components/design-system";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { loginUser, registerUser } from "@/store/auth/authThunks";
import {
  selectAuthDialogMode,
  selectAuthDialogOpen,
  selectAuthRegisterAllowed,
  selectAuthSubmitStatus,
  selectConfigureLoginUserId,
  selectSessionReady,
  setAuthDialogMode,
} from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Styled } from "@/containers/AuthDialogContainer/AuthDialogContainer.styled";
import { layoutTokens } from "@/theme/tokens";
import { mapAuthApiFailure } from "@/utils/authError.utils";
import {
  createLoginFormSchema,
  createRegisterFormSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/validation/auth.validation";
import { useIsMobileBreakpoint } from "@/hooks/useLayoutMode";

export function AuthDialogContainer() {
  const { t } = useTranslation();
  const isMobile = useIsMobileBreakpoint();
  const dispatch = useAppDispatch();
  const { notifyLoginSuccess, notifyRegisterSuccess } = useAuthDialog();

  const openRequested = useAppSelector(selectAuthDialogOpen);
  const sessionReady = useAppSelector(selectSessionReady);
  const open = openRequested && sessionReady;
  const mode = useAppSelector(selectAuthDialogMode);
  const submitStatus = useAppSelector(selectAuthSubmitStatus);
  const configureLoginUserId = useAppSelector(selectConfigureLoginUserId);
  const registerAllowed = useAppSelector(selectAuthRegisterAllowed);
  const isSubmitting = submitStatus === "loading";
  const isConfigureLogin = configureLoginUserId !== null;

  const loginPanelId = useId();
  const registerPanelId = useId();
  const loginFormSchema = useMemo(() => createLoginFormSchema(t), [t]);
  const registerFormSchema = useMemo(() => createRegisterFormSchema(t), [t]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { userId: "", password: "" },
    mode: "onChange",
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { password: "" },
    mode: "onChange",
  });

  const formError =
    mode === "login"
      ? (loginForm.formState.errors.root?.message ?? null)
      : (registerForm.formState.errors.root?.message ?? null);

  useEffect(() => {
    if (!open) {
      return;
    }
    dispatch(setAuthDialogMode(mode));
    loginForm.clearErrors();
    registerForm.clearErrors();
    loginForm.reset({
      userId: configureLoginUserId ?? "",
      password: "",
    });
    registerForm.reset({ password: "" });

    const focusTimer = window.setTimeout(() => {
      if (mode === "login") {
        if (isConfigureLogin) {
          loginForm.setFocus("password");
        } else {
          loginForm.setFocus("userId");
        }
      } else {
        registerForm.setFocus("password");
      }
    }, 0);

    return () => window.clearTimeout(focusTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens or tab changes
  }, [open, mode, configureLoginUserId, isConfigureLogin]);

  const setFormLevelError = (message: string) => {
    if (mode === "login") {
      loginForm.setError("root", { message });
    } else {
      registerForm.setError("root", { message });
    }
  };

  const applyMappedError = (mapped: ReturnType<typeof mapAuthApiFailure>) => {
    if (mapped.field === "form") {
      setFormLevelError(mapped.message);
      return;
    }
    if (mode === "login") {
      const field = mapped.field === "userId" ? "userId" : "password";
      loginForm.setError(field, { message: mapped.message });
    } else {
      registerForm.setError("password", { message: mapped.message });
    }
  };

  const handleLoginSubmit = loginForm.handleSubmit(async (values) => {
    loginForm.clearErrors("root");
    const loginPayload =
      configureLoginUserId !== null ? { ...values, userId: configureLoginUserId } : values;
    const result = await dispatch(loginUser(loginPayload));
    if (loginUser.fulfilled.match(result)) {
      notifyLoginSuccess(result.payload.userId);
      return;
    }
    if (loginUser.rejected.match(result)) {
      const payload = result.payload;
      if (payload) {
        applyMappedError(mapAuthApiFailure(payload, "login", t));
      }
    }
  });

  const handleRegisterSubmit = registerForm.handleSubmit(async (values) => {
    registerForm.clearErrors("root");
    const result = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(result)) {
      notifyRegisterSuccess(result.payload.userId);
      return;
    }
    if (registerUser.rejected.match(result)) {
      const payload = result.payload;
      if (payload) {
        applyMappedError(mapAuthApiFailure(payload, "register", t));
      }
    }
  });

  const handleTabChange = (nextMode: string) => {
    if (!registerAllowed) {
      return;
    }
    dispatch(setAuthDialogMode(nextMode as "login" | "register"));
  };

  const segmentTabs = [
    { id: "login", label: t("Auth.Tab_LogIn") },
    { id: "register", label: t("Auth.Tab_CreateAccount") },
  ];

  const dialogIntro = isConfigureLogin
    ? t("Auth.Dialog_Body_Intro_ConfigureRedirect")
    : t("Auth.Dialog_Body_Intro");

  const passwordToggleAriaLabel = {
    show: t("Common.FieldPassword_AriaLabel_Show"),
    hide: t("Common.FieldPassword_AriaLabel_Hide"),
  };

  return (
    <DialogShell
      open={open}
      fullWidth
      disableEscapeKeyDown
      onClose={(_event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      title={t("Auth.Dialog_Title_AccountAccess")}
      hideHeaderSeparator
    >
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary" id="auth-dialog-desc">
          {dialogIntro}
        </Typography>

        {registerAllowed ? (
          <SegmentTabs
            tabs={segmentTabs}
            value={mode}
            onChange={handleTabChange}
            aria-label={t("Auth.Segment_AriaLabel_LogInOrCreate")}
          />
        ) : null}

        {formError ? (
          <FeedbackBanner severity="error" role="alert">
            {formError}
          </FeedbackBanner>
        ) : null}

        <Box
          role="tabpanel"
          id={loginPanelId}
          aria-labelledby="auth-tab-login"
          hidden={mode !== "login"}
        >
          <Styled.AuthForm noValidate onSubmit={handleLoginSubmit}>
            <FieldText
              label={t("Auth.FieldLabel_AccountId")}
              autoComplete="username"
              disabled={isSubmitting}
              slotProps={{
                input: {
                  readOnly: isConfigureLogin,
                },
              }}
              error={Boolean(loginForm.formState.errors.userId)}
              helperText={loginForm.formState.errors.userId?.message}
              {...loginForm.register("userId")}
            />
            <FieldPassword
              label={t("Auth.FieldLabel_Password")}
              autoComplete="current-password"
              disabled={isSubmitting}
              error={Boolean(loginForm.formState.errors.password)}
              helperText={loginForm.formState.errors.password?.message}
              visibilityToggleAriaLabel={passwordToggleAriaLabel}
              {...loginForm.register("password")}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && mode === "login"
                ? t("Auth.ButtonLabel_LogIn_Loading")
                : t("Auth.ButtonLabel_LogIn")}
            </Button>
          </Styled.AuthForm>
        </Box>

        <Box
          role="tabpanel"
          id={registerPanelId}
          aria-labelledby="auth-tab-register"
          hidden={mode !== "register"}
        >
          <Styled.AuthForm noValidate onSubmit={handleRegisterSubmit}>
            <FieldPassword
              label={t("Auth.FieldLabel_PasswordRegister")}
              autoComplete="new-password"
              disabled={isSubmitting}
              error={Boolean(registerForm.formState.errors.password)}
              helperText={registerForm.formState.errors.password?.message}
              visibilityToggleAriaLabel={passwordToggleAriaLabel}
              {...registerForm.register("password")}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && mode === "register"
                ? t("Auth.ButtonLabel_CreateAccount_Loading")
                : t("Auth.ButtonLabel_CreateAccount")}
            </Button>
          </Styled.AuthForm>
        </Box>
      </Stack>
    </DialogShell>
  );
}
