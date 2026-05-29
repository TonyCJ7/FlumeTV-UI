import { DonateButton } from "@/components/core/DonateButton/DonateButton";
import styled from "@/utils/styled.utils";

const Donate = styled(DonateButton)({});

const FullWidthDonate = styled(DonateButton)(({ theme }) => ({
  width: "100%",
  justifyContent: "center",
  gap: theme.spacing(4),
}));

const DonateImage = styled("img")({
  display: "block",
  flexShrink: 0,
});

export const Styled = {
  Donate,
  FullWidthDonate,
  DonateImage,
} as const;
