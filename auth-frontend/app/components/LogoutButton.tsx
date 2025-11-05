'use client'

import { logout } from "../serverSide/userControlService";

export function LogoutButton() {
    return (
        <form action={logout}>
            <button type="submit" className="w-full bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                Выйти
            </button>
        </form>
    );
}