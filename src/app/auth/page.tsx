'use client';

import classNames from "classnames";

export default function Home() {
    return (
        <div
            className={classNames(
                "flex",
                "justify-center",
                "items-center",
                "h-screen",
                "bg-gray-100",
            )}
        >
            <form
                className={classNames(
                    "bg-white",
                    "p-8",
                    "rounded-lg",
                    "shadow-md",
                    "w-96",
                    "space-y-4",
                )}
            >
                <h1
                    className={classNames(
                        "text-2xl",
                        "font-bold",
                        "text-center",
                        "mb-4",
                        "text-gray-800",
                    )}
                >
                    Вход
                </h1>
                <input
                    className={classNames(
                        "w-full",
                        "p-3",
                        "border",
                        "border-gray-300",
                        "rounded-lg",
                        "focus:outline-none",
                        "focus:ring-2",
                        "focus:ring-blue-500",
                    )}
                    type="text"
                    placeholder="Введите логин"
                />
                <input
                    className={classNames(
                        "w-full",
                        "p-3",
                        "border",
                        "border-gray-300",
                        "rounded-lg",
                        "focus:outline-none",
                        "focus:ring-2",
                        "focus:ring-blue-500",
                    )}
                    type="password"
                    placeholder="Введите пароль"
                />
                <button
                    className={classNames(
                        "w-full",
                        "p-3",
                        "bg-blue-500",
                        "text-white",
                        "font-semibold",
                        "rounded-lg",
                        "hover:bg-blue-600",
                        "transition",
                        "duration-200",
                    )}
                    type="submit"
                >
                    Войти
                </button>
            </form>
        </div>
    );
}
