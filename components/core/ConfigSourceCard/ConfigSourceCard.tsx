"use client";

import { useCallback, useId, useState, type MouseEvent, type SyntheticEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button } from "@/components/design-system";
import { SourceTypeBadge } from "@/components/core/SourceTypeBadge";
import type { MergedConfigRow } from "@/types/configCard.types";
import type {
  ConfigSourceCardLastOutcomeVariant,
  ConfigSourceCardStatusVariant,
} from "@/types/configCard.types";
import { Styled } from "./ConfigSourceCard.styled";

/** Matches switch track 44×26 with 4px outer inset. */
const ACTIVE_TOGGLE_LOADING_RING = {
  viewBox: "0 0 52 34",
  rect: { x: 1, y: 1, width: 50, height: 32, rx: 16 },
} as const;

function ConfigDetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

export type ConfigSourceCardLabels = Readonly<{
  activeSwitchAria: string;
  activeSwitchBusyAria: string;
  badgeDirect: string;
  badgeXtream: string;
  statusDetailsAria: string;
  statusDetailsTitle: string;
  statusTagAria: string;
  lastOutcomeTagAria: string;
  closeDetailsAria: string;
  editAria: string;
  deleteAria: string;
  refetch: string;
  cancel: string;
  viewLogs: string;
  detailProgress: string;
  detailTriggered: string;
  detailEstComplete: string;
  detailEstCompleteApprox: string;
  detailEstCompleteUnavailable: string;
  detailQueuePosition: string;
  detailEstWait: string;
  detailLastPrefetch: string;
  detailNextScheduled: string;
  detailLastOutcome: string;
  detailOutcomeDetail: string;
  detailCurrentStatus: string;
  syncing: string;
  labelRunning: string;
  labelFetching: string;
  labelInQueue: string;
  labelIdleReady: string;
  labelLastOutcome: string;
  detailRows: ReadonlyArray<readonly [label: string, value: string]>;
  prefetchWarningMessage?: string;
  prefetchWarningAria: string;
}>;

type ConfigSourceCardProps = Readonly<{
  row: MergedConfigRow;
  labels: ConfigSourceCardLabels;
  statusPrimary: string;
  statusLastOutcome: string | null;
  statusLastOutcomeVariant: ConfigSourceCardLastOutcomeVariant | null;
  statusVariant: ConfigSourceCardStatusVariant;
  showRefetch: boolean;
  showCancel: boolean;
  showLogs: boolean;
  interactionsDisabled?: boolean;
  pending?: boolean;
  activeTogglePending?: boolean;
  onActiveToggle?: () => void;
  onRefetch?: () => void;
  onCancel?: () => void;
  onViewLogs?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}>;

export function ConfigSourceCard({
  row,
  labels,
  statusPrimary,
  statusLastOutcome,
  statusLastOutcomeVariant,
  statusVariant,
  showRefetch,
  showCancel,
  showLogs,
  interactionsDisabled = false,
  pending = false,
  activeTogglePending = false,
  onActiveToggle,
  onRefetch,
  onCancel,
  onViewLogs,
  onEdit,
  onDelete,
}: ConfigSourceCardProps) {
  const { item } = row;
  const detailsId = useId();
  const prefersFineHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  const [pinnedDetails, setPinnedDetails] = useState(false);
  const [hoverDetails, setHoverDetails] = useState(false);
  const [warningTooltipOpen, setWarningTooltipOpen] = useState(false);

  const isActive = item.isActive;
  const showSyncIcon = statusVariant === "work";
  const showBusyOverlay = pending;
  const showPrefetchWarning = Boolean(labels.prefetchWarningMessage);
  const detailsOpen = pinnedDetails || (hoverDetails && !pinnedDetails);
  const statusTagAria = `${labels.statusTagAria}: ${statusPrimary}`;
  const lastOutcomeTagAria =
    statusLastOutcome != null
      ? `${labels.lastOutcomeTagAria}: ${statusLastOutcome}`
      : labels.lastOutcomeTagAria;

  const togglePinnedDetails = useCallback(() => {
    setPinnedDetails((value) => !value);
  }, []);

  const closePinnedDetails = useCallback(() => {
    setPinnedDetails(false);
  }, []);

  const handleStatusKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePinnedDetails();
    }
  };

  const handleActiveToggleClick = useCallback(() => {
    if (interactionsDisabled || activeTogglePending) {
      return;
    }
    onActiveToggle?.();
  }, [activeTogglePending, interactionsDisabled, onActiveToggle]);

  const toggleWarningTooltip = useCallback(() => {
    setWarningTooltipOpen((value) => !value);
  }, []);

  const handleWarningClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (prefersFineHover) {
        return;
      }
      event.stopPropagation();
      toggleWarningTooltip();
    },
    [prefersFineHover, toggleWarningTooltip],
  );

  const handleWarningTooltipClose = useCallback(
    (_event: SyntheticEvent | Event, reason?: string) => {
      if (prefersFineHover) {
        return;
      }
      // Mobile browsers fire blur/toggle on the same tap that opens — ignore those.
      if (reason === "blur" || reason === "toggle") {
        return;
      }
      setWarningTooltipOpen(false);
    },
    [prefersFineHover],
  );

  const closeWarningTooltip = useCallback(() => {
    setWarningTooltipOpen(false);
  }, []);

  const handleWarningKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleWarningTooltip();
    }
    if (event.key === "Escape") {
      closeWarningTooltip();
    }
  };

  return (
    <Styled.Card
      data-hash={item.hash}
      data-prefetch-band={row.bandFields.band}
      aria-busy={pending || undefined}
      inert={pending ? true : undefined}
      $pending={pending}
      $detailsOpen={detailsOpen || (!prefersFineHover && warningTooltipOpen)}
    >
      {showBusyOverlay ? <Styled.BusyOverlay aria-hidden $visible /> : null}

      <Styled.RowTop>
        <Styled.TitleGroup>
          <Styled.TitleCluster>
            <Styled.Title title={item.configName}>{item.configName}</Styled.Title>
            {showPrefetchWarning ? (
              <ClickAwayListener
                onClickAway={() => {
                  if (!prefersFineHover && warningTooltipOpen) {
                    closeWarningTooltip();
                  }
                }}
                touchEvent="onTouchStart"
                mouseEvent="onMouseDown"
              >
                <Styled.WarningTooltipAnchor>
                  <Tooltip
                    title={labels.prefetchWarningMessage}
                    describeChild
                    arrow
                    open={prefersFineHover ? undefined : warningTooltipOpen}
                    disableHoverListener={!prefersFineHover}
                    disableFocusListener={!prefersFineHover}
                    disableTouchListener
                    onClose={handleWarningTooltipClose}
                    slotProps={{
                      popper: {
                        sx: { zIndex: (theme) => theme.zIndex.tooltip },
                        disablePortal: !prefersFineHover,
                      },

                      tooltip: {
                        sx: { maxWidth: 280 },
                      },
                    }}
                  >
                    <Styled.PrefetchWarningIcon
                      type="button"
                      aria-label={labels.prefetchWarningAria}
                      $fineHover={prefersFineHover}
                      onClick={handleWarningClick}
                      onKeyDown={handleWarningKeyDown}
                    >
                      <WarningAmberOutlinedIcon sx={{ fontSize: 20 }} aria-hidden />
                    </Styled.PrefetchWarningIcon>
                  </Tooltip>
                </Styled.WarningTooltipAnchor>
              </ClickAwayListener>
            ) : null}
            {showLogs ? (
              <Styled.TitleClusterAction>
                <Button
                  type="button"
                  appearance="chipPrimary"
                  disabled={interactionsDisabled}
                  onClick={onViewLogs}
                >
                  {labels.viewLogs}
                </Button>
              </Styled.TitleClusterAction>
            ) : null}
          </Styled.TitleCluster>
        </Styled.TitleGroup>
        <Styled.TopEnd>
          <SourceTypeBadge
            kind={item.type}
            label={item.type === "direct" ? labels.badgeDirect : labels.badgeXtream}
          />
          <Styled.ActiveToggleWrap>
            {activeTogglePending ? (
              <Styled.ActiveToggleLoadingRing
                aria-hidden
                viewBox={ACTIVE_TOGGLE_LOADING_RING.viewBox}
              >
                <rect className="active-toggle-ring__track" {...ACTIVE_TOGGLE_LOADING_RING.rect} />
                <rect
                  className="active-toggle-ring__arc"
                  pathLength={1}
                  {...ACTIVE_TOGGLE_LOADING_RING.rect}
                />
              </Styled.ActiveToggleLoadingRing>
            ) : null}
            <Styled.ActiveToggle
              type="button"
              role="switch"
              aria-checked={isActive}
              aria-disabled={activeTogglePending || interactionsDisabled || undefined}
              aria-busy={activeTogglePending || undefined}
              data-loading={activeTogglePending || undefined}
              aria-label={
                activeTogglePending ? labels.activeSwitchBusyAria : labels.activeSwitchAria
              }
              disabled={interactionsDisabled || activeTogglePending}
              tabIndex={activeTogglePending ? -1 : 0}
              onClick={handleActiveToggleClick}
            >
              <Styled.SwitchTrack className="switch-track" $on={isActive} aria-hidden />
            </Styled.ActiveToggle>
          </Styled.ActiveToggleWrap>
        </Styled.TopEnd>
      </Styled.RowTop>

      <Styled.RowBottom>
        <Styled.StatusRoot
          $hoverDetails={hoverDetails && !pinnedDetails}
          $pinnedDetails={pinnedDetails}
        >
          <Styled.StatusHoverGroup
            onMouseEnter={() => {
              if (prefersFineHover && !pinnedDetails) {
                setHoverDetails(true);
              }
            }}
            onMouseLeave={() => {
              if (prefersFineHover && !pinnedDetails) {
                setHoverDetails(false);
              }
            }}
          >
            <Styled.StatusTagsRow>
              <Styled.StatusTag
                tabIndex={0}
                role="button"
                aria-expanded={pinnedDetails}
                aria-controls={detailsId}
                aria-label={statusTagAria}
                $variant={statusVariant}
                onClick={togglePinnedDetails}
                onKeyDown={handleStatusKeyDown}
              >
                {showSyncIcon ? (
                  <Styled.SyncIcon $variant={statusVariant} $spin aria-hidden>
                    <Styled.SyncIconGlyph>
                      <SyncIcon fontSize="small" />
                    </Styled.SyncIconGlyph>
                  </Styled.SyncIcon>
                ) : null}
                <Styled.StatusLabel>{statusPrimary}</Styled.StatusLabel>
              </Styled.StatusTag>

              {statusLastOutcome && statusLastOutcomeVariant ? (
                <Styled.LastOutcomeTag
                  tabIndex={0}
                  role="button"
                  aria-expanded={pinnedDetails}
                  aria-controls={detailsId}
                  aria-label={lastOutcomeTagAria}
                  $variant={statusLastOutcomeVariant}
                  onClick={togglePinnedDetails}
                  onKeyDown={handleStatusKeyDown}
                >
                  <Styled.StatusLabel>{statusLastOutcome}</Styled.StatusLabel>
                </Styled.LastOutcomeTag>
              ) : null}
            </Styled.StatusTagsRow>

            <Styled.StatusDetails
              id={detailsId}
              className="status-details"
              role="region"
              aria-label={labels.statusDetailsAria}
            >
              <Styled.StatusDetailsInner>
                <Styled.StatusDetailsHead>
                  <Styled.StatusDetailsTitle>{labels.statusDetailsTitle}</Styled.StatusDetailsTitle>
                  <Styled.DetailsClose
                    type="button"
                    size="small"
                    $visible={pinnedDetails}
                    aria-label={labels.closeDetailsAria}
                    onClick={closePinnedDetails}
                  >
                    <CloseIcon fontSize="small" />
                  </Styled.DetailsClose>
                </Styled.StatusDetailsHead>
                <Styled.DetailDl>
                  {labels.detailRows.map(([label, value]) => (
                    <ConfigDetailRow key={label} label={label} value={value} />
                  ))}
                </Styled.DetailDl>
              </Styled.StatusDetailsInner>
            </Styled.StatusDetails>
          </Styled.StatusHoverGroup>
        </Styled.StatusRoot>

        <Styled.BottomActions>
          {showRefetch ? (
            <Button
              type="button"
              appearance="chip"
              disabled={interactionsDisabled}
              onClick={onRefetch}
            >
              {labels.refetch}
            </Button>
          ) : null}
          {showCancel ? (
            <Styled.LinkAction
              type="button"
              appearance="link"
              disabled={interactionsDisabled}
              onClick={onCancel}
            >
              {labels.cancel}
            </Styled.LinkAction>
          ) : null}
          <Styled.IconBtn
            type="button"
            size="small"
            aria-label={labels.editAria}
            disabled={interactionsDisabled}
            onClick={onEdit}
          >
            <EditOutlinedIcon fontSize="small" />
          </Styled.IconBtn>
          <Styled.IconBtn
            type="button"
            size="small"
            $danger
            aria-label={labels.deleteAria}
            disabled={interactionsDisabled}
            onClick={onDelete}
          >
            <DeleteOutlineIcon fontSize="small" />
          </Styled.IconBtn>
        </Styled.BottomActions>
      </Styled.RowBottom>
    </Styled.Card>
  );
}
