'use client'

import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { login } from "../serverSide/userControlService";

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
  const prefilledEmail = searchParams.get('email');
  const prefilledLogin = searchParams.get('login');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Вход в аккаунт
        </h2>

        <form 
          className="space-y-6"
          action={async (formData) => {
            const res = await login(formData);
            if (res?.error) {
              alert(res.error);
            } else {
              alert('Успешный вход!');
              // window.location.href = '/dashboard';
            }
        }}>
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
              defaultValue={prefilledEmail || ''}
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
              placeholder="your_login" 
              required
              defaultValue={prefilledLogin || ''}
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
      </div>
    </div>
  );
}