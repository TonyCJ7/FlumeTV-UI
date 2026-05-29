"use client";

import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Stack, Typography } from "@mui/material";
import { useDialogFullScreen } from "@/hooks/useLayoutMode";
import { useTranslation } from "react-i18next";
import { DialogShell, ToastSnackbar, ToastWell } from "@/components/design-system";
import { dismissRegisterSuccess, selectRegisterSuccessUserId } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Styled } from "./RegisterSuccessDialogContainer.styled";

type ToastState = Readonly<{
  message: string;
  severity: "success" | "error" | "info";
}>;

export function RegisterSuccessDialogContainer() {
  const { t } = useTranslation();
  const isMobile = useDialogFullScreen();
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectRegisterSuccessUserId);
  const open = userId !== null;
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleClose = () => {
    dispatch(dismissRegisterSuccess());
  };

  const handleCopy = async () => {
    if (!userId) {
      return;
    }
    try {
      await navigator.clipboard.writeText(userId);
      setToast({
        message: t("Auth.RegisterSuccess_Toast_CopiedToClipboard"),
        severity: "success",
      });
    } catch {
      // Clipboard may be unavailable — user can still select the code block.
    }
  };

  return (
    <>
      <DialogShell
        open={open}
        fullScreen={isMobile}
        fullWidth
        title={t("Auth.RegisterSuccess_Title_SaveAccountId")}
        onDismiss={handleClose}
        closeAriaLabel={t("Common.ButtonLabel_Close")}
        onClose={handleClose}
      >
        <Stack spacing={3}>
          <Typography variant="body2" color="text.secondary" id="register-success-desc">
            {t("Auth.RegisterSuccess_Body_Intro")}
          </Typography>
          <Styled.UuidBlock role="group" aria-label={t("Auth.RegisterSuccess_AriaLabel_AccountId")}>
            <Styled.UuidCode>{userId}</Styled.UuidCode>
            <Styled.CopyButton
              type="button"
              aria-label={t("Auth.RegisterSuccess_ButtonLabel_CopyAccountId")}
              onClick={handleCopy}
            >
              <ContentCopyIcon fontSize="small" />
            </Styled.CopyButton>
          </Styled.UuidBlock>
          <Styled.ContinueButton autoFocus onClick={handleClose}>
            {t("Auth.RegisterSuccess_ButtonLabel_Continue")}
          </Styled.ContinueButton>
        </Stack>
      </DialogShell>

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
