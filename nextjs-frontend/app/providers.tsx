
'use client';

import { KBarProvider } from "kbar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <KBarProvider>
            <CommandPalette>
                {children}
            </CommandPalette>
        </KBarProvider>
    );
}
