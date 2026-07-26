"use client";

import { use } from "react";
import { TrackingLookup } from "@/components/tracking/tracking-lookup";

export default function TrackingNumberPage({
  params,
}: {
  params: Promise<{ trackingNumber: string }>;
}) {
  const { trackingNumber } = use(params);
  const decoded = decodeURIComponent(trackingNumber);

  return <TrackingLookup initialTrackingNumber={decoded} />;
}
