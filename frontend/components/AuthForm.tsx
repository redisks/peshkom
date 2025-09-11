"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import skeletonPlaceholder from "@/public/images/skeleton.png";
import planeImage from '@/public/images/plane.png';
import windowImage from '@/public/images/window.png';
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthForm() {
  const { login, register, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [firstPasswordVisible, setFirstPasswordVisible] = useState(false);
  const [secondPasswordVisible, setSecondPasswordVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");

    try {
      let result: {
        success: boolean;
        message: string;
      } = {
        success: false,
        message: "",
      };

      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else if (formData.password === formData.confirmPassword) {
        result = await register(
          formData.email,
          formData.password,
          formData.confirmPassword
        );
        await login(formData.email, formData.password);
      }

      setMessage(result.message);
      
      if (result.success) {
        router.push(redirect ?? '/');
      }
    } catch (error) {
      setMessage("Произошла ошибка");
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full flex items-center gap-4 flex-col">
      <header className="font-unbounded text-xl">Добро пожаловать!</header>
      <Image src={isLogin ? windowImage : planeImage} alt="Иллюстрация" className="w-52 mr-8" />
      <h2 className="text-2xl font-unbounded w-full">
        {isLogin ? "Вход" : "Регистрация"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-3 py-5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Пароль
          </label>
          <div className="flex justify-between items-center gap-5 w-full">
            <Input
              type={firstPasswordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="px-3 py-5 text-md"
            />
            {firstPasswordVisible ? (
              <EyeClosed
                className="size-8 text-pale-orange"
                onClick={() =>
                  setFirstPasswordVisible(
                    (firstPasswordVisible) => !firstPasswordVisible
                  )
                }
              />
            ) : (
              <Eye
                className="size-8 text-pale-orange"
                onClick={() =>
                  setFirstPasswordVisible(
                    (firstPasswordVisible) => !firstPasswordVisible
                  )
                }
              />
            )}
          </div>
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подтверждение пароля
            </label>
            <div className="flex justify-between items-center gap-5 w-full">
              <Input
                type={secondPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="px-3 py-5 text-md"
              />
              {secondPasswordVisible ? (
                <EyeClosed
                  className="size-8 text-pale-orange"
                  onClick={() =>
                    setSecondPasswordVisible(
                      (secondPasswordVisible) => !secondPasswordVisible
                    )
                  }
                />
              ) : (
                <Eye
                  className="size-8 text-pale-orange"
                  onClick={() =>
                    setSecondPasswordVisible(
                      (secondPasswordVisible) => !secondPasswordVisible
                    )
                  }
                />
              )}
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={formLoading || authLoading}
          className="bg-pale-orange text-center font-unbounded w-full py-5disabled:opacity-50"
        >
          {formLoading
            ? "Загрузка..."
            : isLogin
            ? "Войти"
            : "Зарегистрироваться"}
        </Button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.includes("успешно")
              ? "bg-green-100 text-green-700 hidden"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-2 pb-5 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-pale-orange hover:text-ideal-red"
        >
          {isLogin
            ? "Нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </div>
  );
}
