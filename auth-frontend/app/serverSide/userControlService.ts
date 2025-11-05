'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:3000';

async function getUserToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get('accessToken')?.value;
}

export async function createUser(formData: FormData) {
    try {
        console.log(API_URL)
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData)),
        });

        const responseBody = await res.json();

        if (!res.ok) {
            return { success: false, error: responseBody.message || 'Ошибка при регистрации.' };
        }

        return { success: true, data: responseBody };

    } catch (error) {
        console.error('Create User Error:', error);
        return { success: false, error: 'Не удалось подключиться к серверу. Попробуйте снова.' };
    }
}

export async function login(formData: FormData) {
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    if (!identifier || !password) {
        return { error: 'Необходимо заполнить все поля' };
    }

    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const requestBody = { [isEmail ? 'email' : 'login']: identifier, password };

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
            try {
                const errorBody = await res.json();
                return { error: errorBody.message || 'Неверные учетные данные.' };
            } catch {
                return { error: 'Неверные учетные данные или ошибка сервера.' };
            }
        }

        const data = await res.json();

        if (!data.message?.accessToken) {
            return { error: 'Не удалось получить токен авторизации от сервера.' };
        }

        (await cookies()).set('accessToken', data.message.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            path: '/',
        });

    } catch (error) {
        console.error('Login Error:', error);
        return { error: 'Не удалось подключиться к серверу. Попробуйте снова.' };
    }

    redirect('/');
}

export async function changeName(formData: FormData) {
    const accessToken = await getUserToken();

    if (!accessToken) {
        redirect('/login');
    }

    const new_username = formData.get('new_username') as string;

    try {
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
                return { success: false, error: 'Ваша сессия истекла. Пожалуйста, войдите снова.' };
            }
            const errorBody = await res.json().catch(() => null);
            return { success: false, error: errorBody?.message || 'Ошибка при смене имени.' };
        }

        return { success: true, data: { newUsername: new_username } };

    } catch (error) {
        console.error('Change Name Error:', error);
        return { success: false, error: 'Не удалось подключиться к серверу. Попробуйте снова.' };
    }
}

export async function logout() {
    (await cookies()).delete('accessToken');
    redirect('/login');
}

export async function getUserName(): Promise<string | null> {
    const accessToken = await getUserToken();

    if (!accessToken) {
        return null;
    }

    try {
        const res = await fetch(`${API_URL}/auth/username`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data.message || null;

    } catch (error) {
        console.error('Get User Name Error:', error);
        return null;
    }
}