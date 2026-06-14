import { NextResponse } from "next/server";

import { getGithubSyncData } from "@/lib/github";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getGithubSyncData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
