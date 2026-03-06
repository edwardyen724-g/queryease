import { verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  output: 'standalone',
};

const isProduction = process.env.NODE_ENV === 'production';

export const middleware = async (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return NextResponse.next();
  } catch (err) {
    console.error('JWT Verification Error:', err instanceof Error ? err.message : String(err));
    return NextResponse.redirect(new URL('/login', req.url));
  }
};