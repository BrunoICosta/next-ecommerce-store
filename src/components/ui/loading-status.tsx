"use client";

import { useI18n } from "@/i18n/i18n-provider";

/** Screen-reader announcement used by the route-level loading.tsx skeletons. */
export function LoadingStatus() {
  const { t } = useI18n();
  return (
    <span className="sr-only" role="status">
      {t.common.loading}
    </span>
  );
}
