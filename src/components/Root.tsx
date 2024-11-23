'use client';

import React from "react";
import Topbar from "@/components/Topbar";
import Loading from "@/components/Loading";
import Message from "@/components/Message";
import {useUser} from "@/hooks/useUser";

export default function Root({children}: { children: React.ReactNode }) {
    useUser();

    return (
        <>
            <Topbar/>
            <div className="mt-12 h-[calc(100vh-3rem)] overflow-auto">
                {children}
            </div>
            <Loading/>
            <Message/>
        </>
    );
}
