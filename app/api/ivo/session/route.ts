import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "ivo_authorized";
const AUTH_COOKIE_VALUE = "v1";

export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE_NAME);

  const authorized = cookie?.value === AUTH_COOKIE_VALUE;

  return NextResponse.json({ authorized });
}

