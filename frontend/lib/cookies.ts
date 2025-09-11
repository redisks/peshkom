import { cookies } from 'next/headers';

export const setAuthCookie = async (token: string) => {
  (await cookies()).set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    path: '/',
  });
};

export const getAuthCookie = async (): Promise<string | undefined> => {
  return (await cookies()).get('auth-token')?.value;
};

export const removeAuthCookie = async () => {
  (await cookies()).delete('auth-token');
};