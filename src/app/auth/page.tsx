'use client';

import classNames from "classnames";
import {useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setAppLoading, setAppLoggedIn, setAppMessage} from "@/store/slices/appSlice";
import {RootState} from "@/store";
import Cookies from "js-cookie";

export default function Home() {
    const dispatch = useDispatch();

    const loggedIn = useSelector((state: RootState) => state.app.loggedIn);

    const [formData, setFormData] = useState({username: "", password: ""});

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        dispatch(setAppLoading(true));
        axios.post('/api/auth', {
            ...formData,
        }).then((res) => {
            const token = res.data;
            Cookies.set('token', token, {expires: 0.5});
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            dispatch(setAppLoggedIn(true));
        }).catch((err) => {
            dispatch(setAppMessage(err.response.data));
        }).finally(() => {
            dispatch(setAppLoading(false));
        })
    };

    const logout = () => {
        Cookies.remove('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch(setAppLoggedIn(false));
    }

    return (
        <div
            className={classNames(
                "flex",
                "justify-center",
                "items-center",
                "h-screen",
                "bg-white",
            )}
        >
            {loggedIn ? (
                <button
                    className={classNames(
                        "w-96",
                        "p-3",
                        "border",
                        "border-gray-200",
                        "hover:bg-gray-200",
                    )}
                    onClick={logout}
                >
                    Выйти
                </button>
            ) : (
                <form
                    className={classNames(
                        "bg-white",
                        "w-96",
                        "space-y-4",
                    )}
                    onSubmit={onSubmit}
                >
                    <input
                        className={classNames(
                            "w-full",
                            "p-3",
                            "border",
                            "border-gray-200",
                            "focus:outline-none",
                            "focus:ring-2",
                            "focus:ring-blue-500",
                        )}
                        type="text"
                        name="username"
                        placeholder="Введите логин"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        className={classNames(
                            "w-full",
                            "p-3",
                            "border",
                            "border-gray-200",
                            "focus:outline-none",
                            "focus:ring-2",
                            "focus:ring-blue-500",
                        )}
                        type="password"
                        name="password"
                        placeholder="Введите пароль"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button
                        className={classNames(
                            "w-full",
                            "p-3",
                            "border",
                            "border-gray-200",
                            "hover:bg-gray-200",
                        )}
                        type="submit"
                    >
                        Войти
                    </button>
                </form>
            )}
        </div>
    );
}
