"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

type AnalyticsProviderProps = {
  children: ReactNode;
};

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key) {
      return;
    }
    const maybeLoaded = (posthog as { __loaded?: boolean }).__loaded;
    if (maybeLoaded) {
      return;
    }
    posthog.init(key, {
      api_host: host || "https://app.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, []);

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
