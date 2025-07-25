import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import mongoose from 'mongoose';

export const runtime = 'nodejs'; // Ensure Node.js runtime (not edge)

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  console.log('Login attempt:', { email, password });

  await connectToDatabase().then(() => console.log('Connected to database, db name :', mongoose.connection.name));

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'no user' }, { status: 401 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user._id,email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}