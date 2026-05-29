"use client";

import type { ReactNode } from "react";
import { AppLayout } from "@/components/layout";

type MainLayoutProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Shared product chrome for `/install` and `/config`.
 * `/` stays outside this group (redirect-only, no shell).
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
