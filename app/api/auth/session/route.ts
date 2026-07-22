/**
 * Single source of truth for "is the visitor logged in". The client calls this
 * once on mount instead of trusting anything persisted in localStorage — the
 * httpOnly session cookies aren't readable by client JS in the first place.
 */
import { NextResponse } from "next/server";
import { fetchCurrentUser } from "@/lib/api/server-auth";

export async function GET() {
  const user = await fetchCurrentUser();
  return NextResponse.json(
    { authenticated: Boolean(user), user },
    { headers: { "Cache-Control": "no-store" } },
  );
}
