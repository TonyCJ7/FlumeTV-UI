"use client";

import { useCallback } from "react";
import { fetchConfigsList } from "@/store/configs/configsThunks";
import { useAppDispatch } from "@/store/hooks";
import { fetchPrefetchStatus } from "@/store/prefetchStatus/prefetchStatusThunks";

/** Refetches config list and prefetch status in parallel (post hash-op refresh). */
export function useRefreshConfigsAndPrefetch() {
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    await Promise.all([dispatch(fetchConfigsList()), dispatch(fetchPrefetchStatus())]);
  }, [dispatch]);
}
