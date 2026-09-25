import { NextResponse } from "next/server";

const serverScope = `arch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ scope: serverScope });
}