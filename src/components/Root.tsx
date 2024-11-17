'use client';

import React from "react";
import Topbar from "@/components/Topbar";
import Loading from "@/components/Loading";
import Message from "@/components/Message";

export default function Root({children}: { children: React.ReactNode }) {
    return (
        <>
            <Topbar/>
            <div className={'fixed top-12 w-full'}>
                {children}
            </div>
            <Loading/>
            <Message/>
        </>
    );
}
