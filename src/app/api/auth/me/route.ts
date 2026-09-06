import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}