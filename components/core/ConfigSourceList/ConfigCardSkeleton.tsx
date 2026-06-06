"use client";

import { Styled } from "./ConfigCardSkeleton.styled";

/** Two-row config card skeleton placeholder. */
export function ConfigCardSkeleton() {
  return (
    <Styled.Card aria-hidden>
      <Styled.Row>
        <Styled.TitleBar variant="rounded" animation="wave" />
        <Styled.MetaBar variant="rounded" animation="wave" />
      </Styled.Row>
      <Styled.RowBottom>
        <Styled.StatusBar variant="rounded" animation="wave" />
        <Styled.ActionsBar variant="rounded" animation="wave" />
      </Styled.RowBottom>
    </Styled.Card>
  );
}
