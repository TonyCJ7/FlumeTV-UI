"use client";

import { useCallback, useState } from "react";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button, DialogShell } from "@/components/design-system";
import { Styled } from "@/containers/LogoutConfirmDialogContainer/LogoutConfirmDialogContainer.styled";
import { logoutUser } from "@/store/auth/authThunks";
import { useAppDispatch } from "@/store/hooks";

type LogoutConfirmDialogContainerProps = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

export function LogoutConfirmDialogContainer({ open, onClose }: LogoutConfirmDialogContainerProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDismiss = useCallback(() => {
    if (confirming) {
      return;
    }
    onClose();
  }, [confirming, onClose]);

  const handleConfirm = useCallback(async () => {
    if (confirming) {
      return;
    }

    setConfirming(true);
    await dispatch(logoutUser());
    setConfirming(false);
    onClose();
    router.push("/install");
  }, [confirming, dispatch, onClose, router]);

  return (
    <DialogShell
      open={open}
      onClose={handleDismiss}
      onDismiss={handleDismiss}
      closeAriaLabel={t("Common.ButtonLabel_Close")}
      fullWidth
      title={t("Shell.Dialog_Title_LogOutConfirm")}
      hideFooterSeparator
      hideHeaderSeparator
      footer={
        <Styled.ActionsRow>
          <Button type="button" appearance="link" disabled={confirming} onClick={handleDismiss}>
            {t("Shell.ButtonLabel_StaySignedIn")}
          </Button>
          <Button
            type="button"
            appearance="danger"
            disabled={confirming}
            onClick={() => void handleConfirm()}
          >
            {t("Shell.ButtonLabel_LogOutConfirm")}
          </Button>
        </Styled.ActionsRow>
      }
    >
      <Typography variant="body2" color="text.secondary">
        {t("Shell.Dialog_Body_LogOutConfirm")}
      </Typography>
    </DialogShell>
  );
}
