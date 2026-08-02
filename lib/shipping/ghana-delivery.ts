/**
 * Client-side Ghana delivery fee lookup from the nationwide master list.
 * Mirrors backend pricing so checkout can quote Accra + outside Accra
 * without waiting on /cart/validate shipping status.
 */
import feeData from "@/lib/shipping/ghana-delivery-fees.json";

export type GhanaDeliveryMatch = {
  fee: number;
  location: string;
  region: string;
  /** Exact town/neighborhood match vs region default. */
  match: "location" | "region";
  shippingZone: "accra" | "ghana_outside_accra";
  deliveryType: "accra_inhouse" | "outside_accra";
};

type FeeRow = {
  location: string;
  region: string;
  fee: number;
};

const LOCATIONS = feeData.locations as FeeRow[];
const REGION_DEFAULTS = feeData.regionDefaults as Record<string, number>;

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const LOCATION_INDEX = new Map<string, FeeRow>();
for (const row of LOCATIONS) {
  LOCATION_INDEX.set(normalizeKey(row.location), row);
  // "Airport Area, Sunyani" also searchable as "Airport Area"
  const beforeComma = row.location.split(",")[0]?.trim();
  if (beforeComma && beforeComma !== row.location) {
    const key = normalizeKey(beforeComma);
    if (!LOCATION_INDEX.has(key)) LOCATION_INDEX.set(key, row);
  }
}

const REGION_INDEX = new Map<string, string>();
for (const region of Object.keys(REGION_DEFAULTS)) {
  REGION_INDEX.set(normalizeKey(region), region);
}

/** Common aliases users type that are not exact master-list rows. */
const LOCATION_ALIASES: Record<string, string> = {
  tema: "Tema Community 1",
};

function resolveRegionCanonical(region: string): string | null {
  const key = normalizeKey(region);
  if (!key) return null;
  return REGION_INDEX.get(key) ?? null;
}

function zoneForRegion(region: string): Pick<
  GhanaDeliveryMatch,
  "shippingZone" | "deliveryType"
> {
  if (normalizeKey(region) === "greater accra") {
    return { shippingZone: "accra", deliveryType: "accra_inhouse" };
  }
  return {
    shippingZone: "ghana_outside_accra",
    deliveryType: "outside_accra",
  };
}

/**
 * Look up delivery fee by city/location and optional region.
 * Prefer exact location match; fall back to region default fee.
 */
export function lookupGhanaDeliveryFee(input: {
  city?: string;
  region?: string;
  country?: string;
}): GhanaDeliveryMatch | null {
  const country = (input.country ?? "Ghana").trim();
  if (country && !/^ghana$/i.test(country)) return null;

  const cityRaw = input.city?.trim() ?? "";
  const regionRaw = input.region?.trim() ?? "";
  const cityKey = normalizeKey(cityRaw);

  // "Accra" is not a single master-list row; use Greater Accra default (₵35).
  if (cityKey === "accra" || cityKey === "greater accra") {
    const fee = REGION_DEFAULTS["Greater Accra"];
    if (fee != null) {
      return {
        fee,
        location: cityRaw || "Accra",
        region: "Greater Accra",
        match: "region",
        ...zoneForRegion("Greater Accra"),
      };
    }
  }

  if (cityRaw) {
    const aliasTarget = LOCATION_ALIASES[cityKey];
    const row =
      LOCATION_INDEX.get(cityKey) ??
      (aliasTarget ? LOCATION_INDEX.get(normalizeKey(aliasTarget)) : undefined);
    if (row) {
      return {
        fee: row.fee,
        location: row.location,
        region: row.region,
        match: "location",
        ...zoneForRegion(row.region),
      };
    }
  }

  const regionCanonical =
    resolveRegionCanonical(regionRaw) ||
    // If they typed a region name into city (e.g. "Ashanti")
    resolveRegionCanonical(cityRaw);

  if (regionCanonical && REGION_DEFAULTS[regionCanonical] != null) {
    return {
      fee: REGION_DEFAULTS[regionCanonical],
      location: cityRaw || regionCanonical,
      region: regionCanonical,
      match: "region",
      ...zoneForRegion(regionCanonical),
    };
  }

  return null;
}

/** Location names for checkout autocomplete (city field). */
export function listGhanaDeliveryLocations(): string[] {
  return LOCATIONS.map((row) => row.location).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function listGhanaRegions(): string[] {
  return Object.keys(REGION_DEFAULTS).sort((a, b) => a.localeCompare(b));
}
