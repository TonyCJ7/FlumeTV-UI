"use client";

import type { ReactNode } from "react";
import { Styled } from "./PrimaryNavTabs.styled";

type PrimaryNavTab = Readonly<{
  id: string;
  label: ReactNode;
  icon?: ReactNode;
}>;

type PrimaryNavTabsProps = Readonly<{
  tabs: PrimaryNavTab[];
  value: string;
  onChange: (id: string) => void;
  /** Drawer sheet uses a vertical stack layout. */
  variant?: "inline" | "drawer";
}>;

/** Two-column shell navigation — equal-width grid + icons. */
export function PrimaryNavTabs({ tabs, value, onChange, variant = "inline" }: PrimaryNavTabsProps) {
  const isDrawer = variant === "drawer";

  return (
    <Styled.Nav $drawer={isDrawer}>
      {tabs.map((tab) => {
        const selected = value === tab.id;
        return (
          <Styled.TabButton
            key={tab.id}
            type="button"
            aria-current={selected ? "true" : undefined}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon ? (
              <Styled.TabIcon className="primary-nav-tab__icon">{tab.icon}</Styled.TabIcon>
            ) : null}
            <Styled.TabLabel>{tab.label}</Styled.TabLabel>
          </Styled.TabButton>
        );
      })}
    </Styled.Nav>
  );
}
