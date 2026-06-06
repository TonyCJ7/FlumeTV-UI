"use client";

import { useCallback } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DialogShell } from "@/components/design-system";
import { DONATE_KOFI_LOGO_SRC } from "@/constants/brand.constants";
import { DONATE_KOFI_URL } from "@/constants/brand.constants";
// GitHub Sponsors — uncomment after GitHub Sponsors program approval.
// import { DONATE_GITHUB_SPONSORS_LOGO_SRC } from "@/constants/brand.constants";
// import { DONATE_GITHUB_SPONSORS_URL } from "@/constants/brand.constants";
import { Styled } from "./DonateDialogContainer.styled";

type DonateDialogContainerProps = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

export function DonateDialogContainer({ open, onClose }: DonateDialogContainerProps) {
  const { t } = useTranslation();

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <DialogShell
      open={open}
      onClose={handleDismiss}
      onDismiss={handleDismiss}
      closeAriaLabel={t("Common.ButtonLabel_Close")}
      fullWidth
      title={t("DonateDialog.Title")}
      hideFooterSeparator
      hideHeaderSeparator
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("DonateDialog.Body")}
      </Typography>
      <Styled.OptionsStack>
        <Styled.OptionLink
          href={DONATE_KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDismiss}
        >
          <Styled.OptionLogo src={DONATE_KOFI_LOGO_SRC} alt="" width={28} height={28} />
          {t("DonateDialog.ButtonLabel_Kofi")}
        </Styled.OptionLink>
        {/* GitHub Sponsors — uncomment after GitHub Sponsors program approval.
        <Styled.OptionLink
          href={DONATE_GITHUB_SPONSORS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDismiss}
        >
          <Styled.OptionLogo src={DONATE_GITHUB_SPONSORS_LOGO_SRC} alt="" width={28} height={28} />
          {t("DonateDialog.ButtonLabel_GitHubSponsors")}
        </Styled.OptionLink>
        */}
      </Styled.OptionsStack>
    </DialogShell>
  );
}
