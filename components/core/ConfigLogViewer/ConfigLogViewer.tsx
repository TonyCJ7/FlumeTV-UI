"use client";

import { useCallback, useEffect, useRef } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useTranslation } from "react-i18next";
import type { UiLogLine } from "@/types/logStream.types";
import { buildLogSectorBytesLabel, shouldShowLogSectorProgress } from "@/utils/logDisplay.utils";
import { Styled } from "./ConfigLogViewer.styled";

type ConfigLogViewerProps = Readonly<{
  lines: readonly UiLogLine[];
  emptyLabel: string;
  ariaLabel: string;
}>;

function logLineScrollSignature(lines: readonly UiLogLine[]): string {
  if (lines.length === 0) {
    return "";
  }
  const last = lines[lines.length - 1];
  return `${lines.length}:${last.id}:${last.seq}:${last.bytesRead ?? ""}:${last.sectorPercent ?? ""}:${last.status ?? ""}`;
}

export function ConfigLogViewer({ lines, emptyLabel, ariaLabel }: ConfigLogViewerProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollSignature = logLineScrollSignature(lines);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node || lines.length === 0) {
      return;
    }
    node.scrollTop = node.scrollHeight;
  }, [lines.length, scrollSignature]);

  const formatSectorBytesLabel = useCallback(
    (line: UiLogLine) => buildLogSectorBytesLabel(line, t),
    [t],
  );

  return (
    <Styled.LogLines
      ref={scrollRef}
      role="log"
      aria-label={ariaLabel}
      aria-live="polite"
      aria-relevant="additions text"
    >
      {lines.length === 0 ? (
        <Styled.LogEmptyText>{emptyLabel}</Styled.LogEmptyText>
      ) : (
        lines.map((line) => {
          const showProgress = shouldShowLogSectorProgress(line);
          const determinate = line.sectorPercent != null;
          const bytesLabel = showProgress ? formatSectorBytesLabel(line) : null;

          return (
            <Styled.LogEntry key={line.id} $tone={line.tone}>
              <Styled.LogEntryTime>{line.time}</Styled.LogEntryTime>
              <Styled.LogEntryBody>
                <Styled.LogEntryMessage $tone={line.tone}>{line.message}</Styled.LogEntryMessage>
                {showProgress ? (
                  <>
                    <Styled.LogEntryProgress>
                      <LinearProgress
                        variant={determinate ? "determinate" : "indeterminate"}
                        value={determinate ? (line.sectorPercent ?? 0) : undefined}
                        aria-label={t("ConfigCard.LogDialog_SectorProgressAria")}
                      />
                    </Styled.LogEntryProgress>
                    {bytesLabel ? <Styled.LogEntryBytes>{bytesLabel}</Styled.LogEntryBytes> : null}
                  </>
                ) : null}
              </Styled.LogEntryBody>
            </Styled.LogEntry>
          );
        })
      )}
    </Styled.LogLines>
  );
}
