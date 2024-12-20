'use client';

import {usePathname} from "next/navigation";
import Link from "next/link";
import classNames from "classnames";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

const links = [
    {href: '/auth', label: 'Авторизация', auth: false},
    {href: '/main', label: 'Основной реестр', auth: false},
    {href: '/all', label: 'Пользовательский реестр', auth: false},
    {href: '/import', label: 'Импорт из 1С', auth: true},
];

const Topbar = () => {
    const pathname = usePathname();
    const loggedIn = useSelector((state: RootState) => state.app.loggedIn);

    return (
        <div className="h-12 flex items-center border-b fixed top-0 left-0 right-0 bg-white z-50 overflow-x-auto overflow-y-hidden">
            <nav className="flex">
                {links.map((link, index) =>
                        (!link.auth || loggedIn) && (
                            <Link
                                key={index}
                                href={link.href}
                                className={classNames({
                                    'px-4 h-12 w-64 hover:bg-gray-200 flex items-center justify-center': true,
                                    'bg-gray-200': pathname === link.href
                                })}
                            >
                                {link.label}
                            </Link>
                        )
                )}
            </nav>
        </div>
    );
};

export default Topbar;
