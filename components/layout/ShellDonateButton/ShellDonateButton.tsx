"use client";

import { BRAND_DONATE_ICON_SRC } from "@/constants/brand.constants";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Styled } from "./ShellDonateButton.styled";

type ShellDonateButtonProps = Readonly<{
  onDonate: () => void;
  fullWidth?: boolean;
  className?: string;
}>;

/** App-shell donate CTA (icon + label). */
export function ShellDonateButton({ onDonate, fullWidth, className }: ShellDonateButtonProps) {
  const { t } = useTranslation();
  const Donate = fullWidth ? Styled.FullWidthDonate : Styled.Donate;

  return (
    <Donate className={className} aria-label={t("Shell.Donate_AriaLabel")} onClick={onDonate}>
      <Styled.DonateImage src={BRAND_DONATE_ICON_SRC} alt="" width={28} height={28} />
      <Box component="span" className="btn-donate-label">
        {t("Shell.Donate_ButtonLabel")}
      </Box>
    </Donate>
  );
}
