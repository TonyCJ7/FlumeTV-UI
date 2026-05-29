"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Styled } from "./SegmentTabs.styled";

type SegmentTab = Readonly<{
  id: string;
  label: ReactNode;
}>;

type SegmentTabsProps = Readonly<{
  tabs: SegmentTab[];
  value: string;
  onChange: (id: string) => void;
  "aria-label": string;
}>;

/** Merged two-option segment control (auth dialog pattern). */
export function SegmentTabs({ tabs, value, onChange, "aria-label": ariaLabel }: SegmentTabsProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === value);
    if (currentIndex < 0) {
      return;
    }
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    if (nextTab) {
      onChange(nextTab.id);
    }
  };

  return (
    <Styled.TabGroup
      exclusive
      fullWidth
      value={value}
      role="tablist"
      aria-label={ariaLabel}
      onChange={(_, next) => next && onChange(next)}
    >
      {tabs.map((tab) => (
        <Styled.Tab
          key={tab.id}
          value={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          tabIndex={value === tab.id ? 0 : -1}
          onKeyDown={handleKeyDown}
        >
          {tab.label}
        </Styled.Tab>
      ))}
    </Styled.TabGroup>
  );
}
