import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "rn_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7;

type AdminJwt = {
  role: "admin";
  email: string;
};

export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set on the server (never NEXT_PUBLIC_*)."
    );
  }
  return { email, password };
}

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set to a long random value.");
  }
  return secret;
}

export function signAdminToken(email: string) {
  const payload: AdminJwt = { role: "admin", email };
  return jwt.sign(payload, jwtSecret(), { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): { email: string } | null {
  try {
    const payload = jwt.verify(token, jwtSecret()) as Partial<AdminJwt>;
    if (payload.role !== "admin" || !payload.email) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}

export function readAdminFromRequest(req: NextRequest) {
  const cookieToken = req.cookies.get(ADMIN_COOKIE)?.value;
  const header = req.headers.get("authorization");
  const bearer =
    header?.startsWith("Bearer ") ? header.slice(7).trim() : undefined;
  const token = cookieToken || bearer;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Unauthorized. Sign in from the website account page." },
    { status: 401 }
  );
}

export function requireAdmin(req: NextRequest) {
  const admin = readAdminFromRequest(req);
  if (!admin) return { admin: null, error: unauthorized() };
  return { admin, error: null };
}
