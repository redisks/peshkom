import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import { comparePasswords } from '@/lib/bcrypt';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/cookies';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Валидация
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email и пароль обязательны',
        },
        { status: 400 }
      );
    }

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Неверный email или пароль',
        },
        { status: 401 }
      );
    }

    // Проверка пароля
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Неверный email или пароль',
        },
        { status: 401 }
      );
    }

    // Генерация токена
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Установка куки
    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: 'Вход выполнен успешно',
        user: {
          id: user._id,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка сервера',
      },
      { status: 500 }
    );
  }
}