"use client";

import { useEffect } from "react";
import { Alert, AlertTitle, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Styled } from "./AppStatusPage.styled";

type RootErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootErrorBoundary({ error, reset }: RootErrorBoundaryProps) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Styled.StatusMain role="alert">
      <Stack spacing={2}>
        <Alert severity="error">
          <AlertTitle>{t("Common.State_GenericErrorHeading")}</AlertTitle>
          {t("Common.Body_GenericErrorHint")}
        </Alert>
        <Button type="button" variant="contained" color="inherit" onClick={reset}>
          {t("Common.ButtonLabel_TryAgain")}
        </Button>
      </Stack>
    </Styled.StatusMain>
  );
}
