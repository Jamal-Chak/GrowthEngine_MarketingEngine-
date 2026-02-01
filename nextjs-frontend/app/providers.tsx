
'use client';

import { KBarProvider } from "kbar";
import { SessionProvider } from "next-auth/react";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthProvider>
                <KBarProvider>
                    <CommandPalette>
                        {children}
                    </CommandPalette>
                </KBarProvider>
            </AuthProvider>
        </SessionProvider>
    );
}
