import { NextResponse } from "next/server";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  "admin@rnsareehandlooms.com";
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ||
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
  "RNAdmin@2026";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (
      email === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      return NextResponse.json({
        ok: true,
        admin: {
          email: ADMIN_EMAIL,
          name: "RN Admin",
          role: "admin",
        },
      });
    }

    return NextResponse.json(
      { ok: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
