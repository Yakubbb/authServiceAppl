'use client'

import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createUser } from "../serverSide/userControlService";
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Регистрация...' : 'Зарегистрироваться'}
    </button>
  );
}

export function RegistrationForm() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Создание аккаунта
        </h2>

        <form 
          className="space-y-6"
          action={async (formData) => {
            const res = await createUser(formData);

            if (res?.error) {
              alert(res.error);
            } else {
              const email = formData.get('email') as string;
              const login = formData.get('login') as string;

              const params = new URLSearchParams();
              params.append('email', email);
              params.append('login', login);
              
              router.push(`/login?${params.toString()}`);
            }
        }}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Имя пользователя
            </label>
            <input 
              id="username"
              name="username" 
              type="text" 
              placeholder="Как вас называть" 
              required 
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
              Логин
            </label>
            <input 
              id="login"
              name="login" 
              type="text" 
              placeholder="your_unique_login" 
              required 
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input 
              id="email"
              name="email" 
              type="email" 
              placeholder="you@example.com" 
              required 
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
          
          <SubmitButton />
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}