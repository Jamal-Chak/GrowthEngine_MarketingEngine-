
'use client';

import { KBarProvider } from "kbar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <KBarProvider>
                <CommandPalette>
                    {children}
                </CommandPalette>
            </KBarProvider>
        </AuthProvider>
    );
}
