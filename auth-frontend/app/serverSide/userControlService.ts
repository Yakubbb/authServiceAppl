'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function createUser(formData: FormData) {
    const login = formData.get('login') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, email, password, username }),
    });

    if (!res.ok) {
        const error = await res.json();
        return { error: error.message || 'Ошибка регистрации' };
    }

    return { message: 'Пользователь успешно зарегистрирован' };
}

export async function login(formData: FormData) {
    const login = formData.get('login') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, email, password }),
    });

    if (!res.ok) {
        return { error: 'Неверные учетные данные' };
    }

    const data = await res.json();
    
    (await cookies()).set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/',
    });

    return { success: true };
}

export async function changeName(formData: FormData) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { error: 'Вы не авторизованы' };
    }

    const new_username = formData.get('new_username') as string;

    const res = await fetch(`${API_URL}/auth/changeProfileName`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ new_username }),
    });

    if (!res.ok) {
        if (res.status === 401) {
            return { error: 'Сессия истекла, пожалуйста, войдите снова' };
        }
        return { error: 'Ошибка при смене имени' };
    }

    const data = await res.json();
    return { message: data.message };
}