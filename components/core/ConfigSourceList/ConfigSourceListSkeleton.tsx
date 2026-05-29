"use client";

import { ConfigCardSkeleton } from "./ConfigCardSkeleton";
import { ConfigListGrid } from "./ConfigSourceList.styled";

export function ConfigSourceListSkeleton() {
  return (
    <ConfigListGrid aria-busy="true">
      <ConfigCardSkeleton />
      <ConfigCardSkeleton />
    </ConfigListGrid>
  );
}
