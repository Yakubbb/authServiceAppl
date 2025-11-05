'use client'

import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { login } from "../serverSide/userControlService";
import Link from 'next/link';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Вход...' : 'Войти'}
    </button>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const prefilledIdentifier = searchParams.get('email') || searchParams.get('login');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Вход в аккаунт
        </h2>

        <form 
          className="space-y-6"
          action={async (formData) => {
            setError(null);
            const res = await login(formData);
            if (res?.error) {
              setError(res.error);
            }
        }}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
              Email или Логин
            </label>
            <input 
              id="identifier"
              name="identifier" 
              type="text" 
              placeholder="you@example.com или ваш логин" 
              required 
              defaultValue={prefilledIdentifier || ''}
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input 
              id="password"
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Ошибка!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          <SubmitButton />
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Нет аккаунта?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}