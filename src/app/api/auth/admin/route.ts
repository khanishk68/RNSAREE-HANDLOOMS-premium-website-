import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  getAdminCredentials,
  readAdminFromRequest,
  signAdminToken,
} from "@/lib/admin-auth";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const admin = readAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ ok: false, admin: null }, { status: 401 });
    }
    return NextResponse.json({
      ok: true,
      admin: {
        email: admin.email,
        name: "RN Admin",
        role: "admin",
      },
    });
  } catch (err) {
    console.error("Admin session check failed:", err);
    return NextResponse.json(
      { ok: false, error: "Server auth is not configured" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email: expectedEmail, password: expectedPassword } =
      getAdminCredentials();
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (
      email === expectedEmail.toLowerCase() &&
      password === expectedPassword
    ) {
      const token = signAdminToken(expectedEmail);
      const res = NextResponse.json({
        ok: true,
        admin: {
          email: expectedEmail,
          name: "RN Admin",
          role: "admin",
        },
      });
      res.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
      return res;
    }

    return NextResponse.json(
      { ok: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (err) {
    console.error("Admin login failed:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request or missing server credentials" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    ...adminCookieOptions(),
    maxAge: 0,
  });
  return res;
}
