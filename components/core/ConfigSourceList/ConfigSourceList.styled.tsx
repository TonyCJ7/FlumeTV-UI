"use client";

import Box from "@mui/material/Box";
import styled from "@/utils/styled.utils";

export const ConfigListGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(3),
  "@media (min-width: 720px)": {
    gridTemplateColumns: "1fr 1fr",
  },
}));

/** Prototype `#config-list > .empty` / `.empty` */
export const ConfigListEmpty = styled("p")(({ theme }) => ({
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: `${theme.spacing(6)} ${theme.spacing(3)}`,
  typography: "body2",
  color: theme.palette.text.secondary,
  margin: 0,
}));
