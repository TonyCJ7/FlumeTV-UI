"use client";

import { Skeleton } from "@mui/material";
import { layoutTokens } from "@/theme/tokens";
import styled from "@/utils/styled.utils";

const Card = styled("article")(({ theme }) => ({
  pointerEvents: "none",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(6),
  padding: theme.spacing(4),
  borderRadius: layoutTokens.radiusMd,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const Row = styled("div")({
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "flex-start",
  gap: "8px 12px",
});

const RowBottom = styled(Row)({
  alignItems: "center",
});

const TitleBar = styled(Skeleton)({
  flex: "1 1 0",
  minWidth: 0,
  height: "1.25rem",
  maxWidth: "100%",
});

const MetaBar = styled(Skeleton)({
  width: "7rem",
  height: "1.5rem",
  borderRadius: layoutTokens.radiusSm,
  flexShrink: 0,
  marginLeft: "auto",
});

const StatusBar = styled(Skeleton)({
  width: "8.5rem",
  height: "1.75rem",
  borderRadius: 999,
});

const ActionsBar = styled(Skeleton)({
  flex: "0 0 5rem",
  height: "1.75rem",
  marginLeft: "auto",
  maxWidth: "6rem",
  borderRadius: layoutTokens.radiusSm,
});

/** Two-row config card skeleton placeholder. */
export function ConfigCardSkeleton() {
  return (
    <Card aria-hidden>
      <Row>
        <TitleBar variant="rounded" animation="wave" />
        <MetaBar variant="rounded" animation="wave" />
      </Row>
      <RowBottom>
        <StatusBar variant="rounded" animation="wave" />
        <ActionsBar variant="rounded" animation="wave" />
      </RowBottom>
    </Card>
  );
}
