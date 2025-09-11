import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthCookie } from '@/lib/cookies';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    const token = getAuthCookie();
    
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Не авторизован',
        },
        { status: 401 }
      );
    }

    const decoded = await verifyToken((await token) ?? "");
    await connectDB();

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Пользователь не найден',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Не авторизован',
      },
      { status: 401 }
    );
  }
}