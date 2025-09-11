import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/cookies';

export async function POST() {
  removeAuthCookie();

  return NextResponse.json(
    {
      success: true,
      message: 'Выход выполнен успешно',
    },
    { status: 200 }
  );
}