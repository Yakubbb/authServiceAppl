'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getUserToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    return accessToken

}

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
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    if (!identifier || !password) {
        return { error: 'Необходимо заполнить все поля' };
    }

    const emailRegex = /\S+@\S+\.\S+/;
    const isEmail = emailRegex.test(identifier);

    let requestBody;

    if (isEmail) {
        requestBody = {
            email: identifier,
            password: password
        };
    } else {
        requestBody = {
            login: identifier,
            password: password
        };
    }

    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
        return { error: 'Неверные учетные данные' };
    }
    const data = await res.json();
    console.log(data);
    (await cookies()).set('accessToken', data.message!.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/',
    });

    redirect('/');
}

export async function changeName(formData: FormData) {
    const accessToken = await getUserToken()

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
    return { success: true, newUsername: new_username };
}
export async function logout() {
    (await cookies()).delete('accessToken');
    console.log(cookies());
    redirect('/login');
}

export async function getUserName() {
    const accessToken = await getUserToken()
    const res = await fetch(`${API_URL}/auth/username`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if (res.ok) {
        const data = await res.json();
        return data.message
    }

}