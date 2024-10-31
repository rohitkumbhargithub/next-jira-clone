import { UserButton } from "@/features/auth/componets/user-button";
import Link from "next/link";
import React from "react";

interface StandaloneLayoutProrps {
    children: React.ReactNode
}

const Standalone = ({ children }: StandaloneLayoutProrps) => {
    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center h-[73px]">
                    <Link href="/">
                        {/* <Image/> */}
                        <h1>LOGO</h1>
                    </Link>
                    <UserButton/>
                </nav>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
                {children}    
            </div> 
        </main>
    )
}

export default Standalone;