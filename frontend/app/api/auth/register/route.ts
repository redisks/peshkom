import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/cookies';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password, confirmPassword } = await request.json();

    // Валидация
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Все поля обязательны для заполнения',
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Пароли не совпадают',
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Пароль должен содержать минимум 6 символов',
        },
        { status: 400 }
      );
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Пользователь с таким email уже существует',
        },
        { status: 400 }
      );
    }

    // Создание пользователя
    const user = new User({
      email,
      password,
    });

    await user.save();

    // Генерация токена
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Установка куки
    setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: 'Регистрация прошла успешно',
        user: {
          id: user._id,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка сервера',
      },
      { status: 500 }
    );
  }
}