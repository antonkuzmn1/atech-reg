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
        <div className="bg-white h-12 flex items-center border-b-2">
            <nav className="flex space-x-4 ml-8">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.href}
                        className={classNames({
                            'px-4 py-2 text-black hover:bg-gray-200 rounded-md transition-all duration-200': true,
                            'bg-blue-500 text-white': pathname === link.href
                        })}
                        children={link.label}
                    />
                ))}
            </nav>
        </div>
    );
};
export default Topbar;
