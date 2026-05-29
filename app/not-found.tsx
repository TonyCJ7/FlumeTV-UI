"use client";

import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Styled } from "./AppStatusPage.styled";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Styled.NotFoundMain>
      <Typography variant="h5" component="h1">
        {t("NotFound.Page_Title_NotFound")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("NotFound.Page_Body_UnknownOrMoved")}
      </Typography>
      <Styled.HomeLink href="/">
        <Styled.HomeLinkButton>{t("NotFound.Navigation_GoHome")}</Styled.HomeLinkButton>
      </Styled.HomeLink>
    </Styled.NotFoundMain>
  );
}
