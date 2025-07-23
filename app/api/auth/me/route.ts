import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  console.log("🟡 /api/auth/me token:", token);

  if (!token) {
    console.warn("🔴 No token found");
    return NextResponse.json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("🟢 Token verified. Decoded user:", decoded);
    return NextResponse.json({ loggedIn: true, user: decoded });
  } catch (err) {
    console.error("🔴 Token verification failed:", err);
    return NextResponse.json({ loggedIn: false });
  }
}
