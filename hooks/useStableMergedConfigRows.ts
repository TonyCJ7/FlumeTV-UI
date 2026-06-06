"use client";

import { useEffect, useRef, useState } from "react";
import { PREFETCH_BAND_RANK, PREFETCH_BAND_STABILIZE_MS } from "@/constants/prefetch.constants";
import type { MergedConfigRow } from "@/types/configCard.types";
import type { PrefetchUiBand } from "@/types/prefetchUiBand.types";

function applyStableBand(row: MergedConfigRow, stableBand: PrefetchUiBand): MergedConfigRow {
  if (row.bandFields.band === stableBand) {
    return row;
  }
  return {
    ...row,
    bandFields: { ...row.bandFields, band: stableBand },
  };
}

function buildStableRows(
  rows: MergedConfigRow[],
  stableBands: Map<string, PrefetchUiBand>,
): MergedConfigRow[] {
  return rows.map((row) => {
    const stableBand = stableBands.get(row.item.hash) ?? row.bandFields.band;
    return applyStableBand(row, stableBand);
  });
}

/**
 * Stabilizes per-hash prefetch UI bands across poll ticks: upgrades apply
 * immediately; downgrades wait {@link PREFETCH_BAND_STABILIZE_MS}.
 */
export function useStableMergedConfigRows(rows: MergedConfigRow[]): MergedConfigRow[] {
  const stableBandsRef = useRef<Map<string, PrefetchUiBand>>(new Map());
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const rowsRef = useRef(rows);
  const [stableRows, setStableRows] = useState(rows);

  useEffect(() => {
    rowsRef.current = rows;
    const stableBands = new Map(stableBandsRef.current);
    const timers = timersRef.current;
    const activeHashes = new Set(rows.map((row) => row.item.hash));

    for (const row of rows) {
      const hash = row.item.hash;
      const nextBand = row.bandFields.band;
      const previousBand = stableBands.get(hash) ?? nextBand;

      if (previousBand === nextBand) {
        const pending = timers.get(hash);
        if (pending) {
          clearTimeout(pending);
          timers.delete(hash);
        }
        stableBands.set(hash, nextBand);
        continue;
      }

      if (PREFETCH_BAND_RANK[nextBand] >= PREFETCH_BAND_RANK[previousBand]) {
        const pending = timers.get(hash);
        if (pending) {
          clearTimeout(pending);
          timers.delete(hash);
        }
        stableBands.set(hash, nextBand);
        continue;
      }

      if (!timers.has(hash)) {
        const downgradeTarget = nextBand;
        timers.set(
          hash,
          setTimeout(() => {
            timers.delete(hash);
            const latestRows = rowsRef.current;
            const latestRow = latestRows.find((entry) => entry.item.hash === hash);
            if (!latestRow) {
              return;
            }
            const heldBand = stableBandsRef.current.get(hash);
            if (
              heldBand == null ||
              PREFETCH_BAND_RANK[latestRow.bandFields.band] >= PREFETCH_BAND_RANK[heldBand]
            ) {
              stableBandsRef.current.set(hash, latestRow.bandFields.band);
            } else {
              stableBandsRef.current.set(hash, downgradeTarget);
            }
            setStableRows(buildStableRows(latestRows, stableBandsRef.current));
          }, PREFETCH_BAND_STABILIZE_MS),
        );
      }
    }

    for (const hash of [...timers.keys()]) {
      if (!activeHashes.has(hash)) {
        const pending = timers.get(hash);
        if (pending) {
          clearTimeout(pending);
        }
        timers.delete(hash);
      }
    }

    for (const hash of [...stableBands.keys()]) {
      if (!activeHashes.has(hash)) {
        stableBands.delete(hash);
      }
    }

    stableBandsRef.current = stableBands;
    setStableRows(buildStableRows(rows, stableBands));
  }, [rows]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const pending of timers.values()) {
        clearTimeout(pending);
      }
      timers.clear();
    };
  }, []);

  return stableRows;
}
