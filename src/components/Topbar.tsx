'use client';

import {usePathname} from "next/navigation";
import Link from "next/link";
import classNames from "classnames";

const links = [
    {href: '/auth', label: 'Авторизация'},
    {href: '/main', label: 'Основной реестр'},
    {href: '/all', label: 'Пользовательский реестр'},
    {href: '/import', label: 'Импорт из 1С'},
];

const Topbar = () => {
    const pathname = usePathname();

    return (
        <div className="h-12 flex items-center border-b-2 fixed top-0 left-0 right-0 bg-white z-50">
            <nav className="flex">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.href}
                        className={classNames({
                            'px-4 h-12 w-64 hover:bg-gray-200 flex items-center justify-center': true,
                            'bg-gray-200': pathname === link.href
                        })}
                        children={link.label}
                    />
                ))}
            </nav>
        </div>
    );
};
export default Topbar;
