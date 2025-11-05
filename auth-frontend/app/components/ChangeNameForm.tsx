'use client'

import { useFormStatus } from "react-dom";
import { changeName, getUserName } from "../serverSide/userControlService";
import { useEffect, useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {pending ? 'Сохранение...' : 'Сменить имя'}
        </button>
    )
}

export function ChangeNameForm() {
    const [oldName, setOldName] = useState<string>('Загрузка...');

    useEffect(() => {
        const fetchUserName = async () => {
            const name = await getUserName();
            if (name) {
                setOldName(name);
            }
        }
        fetchUserName();
    }, []);

    return (
        <form className="space-y-6" action={async (formData) => {
            const res = await changeName(formData);
            
            if (res?.error) {
                alert(res.error);
            } else if (res?.success && res.newUsername) {
                setOldName(res.newUsername);
            }
        }}>
            <div>
                <label htmlFor="new_username" className="block text-sm font-medium text-gray-700 mb-2">
                    Введите новое имя пользователя
                </label>
                <input
                    id="new_username"
                    name="new_username"
                    type="text"
                    placeholder={oldName}
                    key={oldName}
                    required
                    className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <SubmitButton />
        </form>
    )
}