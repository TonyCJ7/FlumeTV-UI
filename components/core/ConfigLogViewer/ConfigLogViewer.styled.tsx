import styled from "@/utils/styled.utils";
import { layoutTokens } from "@/theme/tokens";
import type { RoomLogTone } from "@/types/room.types";

type LogToneProps = Readonly<{
  $tone: RoomLogTone;
}>;

function resolveLogToneColor(
  tone: RoomLogTone,
  theme: {
    palette: {
      text: { primary: string };
      error: { main: string };
      warning: { main: string };
      success: { main: string };
      info: { main: string };
    };
  },
): string {
  switch (tone) {
    case "error":
      return theme.palette.error.main;
    case "warning":
      return theme.palette.warning.main;
    case "success":
      return theme.palette.success.main;
    case "info":
      return theme.palette.info.main;
    default:
      return theme.palette.text.primary;
  }
}

const LogLines = styled("div")(({ theme }) => ({
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "0.75rem",
  lineHeight: 1.5,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: layoutTokens.radiusMd,
  padding: theme.spacing(2),
  maxHeight: 280,
  overflow: "auto",
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

const LogEmptyText = styled("span")(({ theme }) => ({
  font: "inherit",
  color: theme.palette.text.secondary,
}));

const LogEntry = styled("div")<LogToneProps>(({ theme, $tone }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "flex-start",
}));

const LogEntryTime = styled("span")(({ theme }) => ({
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontVariantNumeric: "tabular-nums",
}));

const LogEntryBody = styled("div")({
  flex: 1,
  minWidth: 0,
});

const LogEntryMessage = styled("div")<LogToneProps>(({ theme, $tone }) => ({
  color: resolveLogToneColor($tone, theme),
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}));

const LogEntryProgress = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(0.75),
}));

const LogEntryBytes = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: "0.6875rem",
  fontVariantNumeric: "tabular-nums",
}));

export const Styled = {
  LogLines,
  LogEmptyText,
  LogEntry,
  LogEntryTime,
  LogEntryBody,
  LogEntryMessage,
  LogEntryProgress,
  LogEntryBytes,
} as const;
