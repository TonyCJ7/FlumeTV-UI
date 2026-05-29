import Link from "next/link";
import { Button } from "@/components/design-system/Button/Button";
import styled from "@/utils/styled.utils";

const StatusMain = styled("main")({
  padding: 24,
  maxWidth: 640,
});

const NotFoundMain = styled("main")({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  padding: 24,
  maxWidth: 560,
});

const HomeLink = styled(Link)({
  alignSelf: "flex-start",
  textDecoration: "none",
});

const HomeLinkButton = styled(Button)({});

export const Styled = {
  StatusMain,
  NotFoundMain,
  HomeLink,
  HomeLinkButton,
} as const;
