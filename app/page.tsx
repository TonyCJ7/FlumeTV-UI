"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stack } from "@mui/material";
import { SkeletonBlock } from "@/components/design-system";
import { selectIsAuthed, selectSessionReady } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";
import { Styled } from "./page.styled";

/** Landing route — redirects once session bootstrap completes. */
export default function HomePage() {
  const router = useRouter();
  const sessionReady = useAppSelector(selectSessionReady);
  const isAuthed = useAppSelector(selectIsAuthed);

  useEffect(() => {
    if (!sessionReady) {
      return;
    }
    router.replace(isAuthed ? "/config" : "/install");
  }, [isAuthed, router, sessionReady]);

  return (
    <Styled.HomeContainer maxWidth="sm">
      <Stack spacing={2} component="main" aria-busy="true">
        <SkeletonBlock />
        <SkeletonBlock showCard />
      </Stack>
    </Styled.HomeContainer>
  );
}
