import { apiRequest, asList } from "@/lib/api/client";

/** Row from `GET /workflow/execute/announcement.get-messages`. */
export type ApiAnnouncementMessage = {
  id: string;
  text: string;
  href: string | null;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/** Row from `GET /workflow/execute/announcement.get-config`. */
export type ApiAnnouncementConfig = {
  isEnabled: boolean;
  rotationIntervalMs: number;
  backgroundColor: string;
  textColor: string;
};

export type AnnouncementBannerData = {
  isEnabled: boolean;
  rotationIntervalMs: number;
  backgroundColor: string;
  textColor: string;
  messages: ApiAnnouncementMessage[];
};

const DEFAULT_CONFIG: Omit<AnnouncementBannerData, "messages"> = {
  isEnabled: true,
  rotationIntervalMs: 4000,
  backgroundColor: "#18181b",
  textColor: "#ffffff",
};

function isMessageLive(message: ApiAnnouncementMessage, now: number): boolean {
  if (!message.isActive) return false;
  if (message.startsAt) {
    const start = Date.parse(message.startsAt);
    if (!Number.isNaN(start) && start > now) return false;
  }
  if (message.endsAt) {
    const end = Date.parse(message.endsAt);
    if (!Number.isNaN(end) && end < now) return false;
  }
  return true;
}

function parseConfig(payload: unknown): ApiAnnouncementConfig | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if (typeof obj.isEnabled !== "boolean") return null;
  return {
    isEnabled: obj.isEnabled,
    rotationIntervalMs:
      typeof obj.rotationIntervalMs === "number" && obj.rotationIntervalMs > 0
        ? obj.rotationIntervalMs
        : DEFAULT_CONFIG.rotationIntervalMs,
    backgroundColor:
      typeof obj.backgroundColor === "string" && obj.backgroundColor
        ? obj.backgroundColor
        : DEFAULT_CONFIG.backgroundColor,
    textColor:
      typeof obj.textColor === "string" && obj.textColor
        ? obj.textColor
        : DEFAULT_CONFIG.textColor,
  };
}

export async function getAnnouncementMessages(): Promise<
  ApiAnnouncementMessage[]
> {
  const payload = await apiRequest<unknown>(
    "/workflow/execute/announcement.get-messages",
    { revalidate: 60 },
  );
  return asList<ApiAnnouncementMessage>(payload);
}

export async function getAnnouncementConfig(): Promise<ApiAnnouncementConfig | null> {
  try {
    const payload = await apiRequest<unknown>(
      "/workflow/execute/announcement.get-config",
      { revalidate: 60 },
    );
    return parseConfig(payload);
  } catch {
    // Config endpoint may 500 when no row exists yet — fall back to defaults.
    return null;
  }
}

/** Active, in-window messages + banner config for the storefront chrome. */
export async function getAnnouncementBanner(): Promise<AnnouncementBannerData> {
  const [messagesResult, config] = await Promise.all([
    getAnnouncementMessages().catch(() => [] as ApiAnnouncementMessage[]),
    getAnnouncementConfig(),
  ]);

  const now = Date.now();
  const messages = messagesResult
    .filter((message) => isMessageLive(message, now))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    ...(config ?? DEFAULT_CONFIG),
    messages,
  };
}
