import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "ivo_authorized";
const AUTH_COOKIE_VALUE = "v1";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { inviteCode?: string } | null;

  const inviteCode = body?.inviteCode?.trim();
  const expectedCode = process.env.IVO_INVITE_CODE;

  if (!expectedCode) {
    return NextResponse.json(
      { error: "Ivo is not available right now. Please reach out on LinkedIn instead." },
      { status: 503 },
    );
  }

  if (!inviteCode || inviteCode !== expectedCode) {
    return NextResponse.json(
      {
        error:
          "That invite code doesn't match what I have on record. Reach out to Iván on LinkedIn if you need access.",
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: AUTH_COOKIE_VALUE,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  });

  return response;
}

