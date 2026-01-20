
import * as React from "react";
import {
    KBarPortal,
    KBarPositioner,
    KBarAnimator,
    KBarSearch,
    useMatches,
    KBarResults,
    Action,
    useRegisterActions,
} from "kbar";
import { useRouter } from "next/navigation";
import { Zap, Target, LayoutDashboard, Settings, LogOut, Search } from "lucide-react";

export const CommandPalette = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const actions: Action[] = [
        {
            id: "dashboard",
            name: "Dashboard",
            shortcut: ["d"],
            keywords: "home dashboard index",
            perform: () => router.push("/dashboard"),
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            id: "missions",
            name: "Missions",
            shortcut: ["m"],
            keywords: "tasks missions goals",
            perform: () => router.push("/dashboard/missions"),
            icon: <Target className="w-5 h-5" />,
        },
        {
            id: "settings",
            name: "Settings",
            shortcut: ["s"],
            keywords: "settings profile account",
            perform: () => router.push("/settings"),
            icon: <Settings className="w-5 h-5" />,
        },
        {
            id: "logout",
            name: "Logout",
            shortcut: ["q"],
            keywords: "signout logout exit",
            perform: () => {
                // Add logout logic here later
                router.push("/");
            },
            icon: <LogOut className="w-5 h-5" />,
        },
    ];

    useRegisterActions(actions);

    return (
        <>
            <KBarPortal>
                <KBarPositioner className="z-[99] bg-black/40 backdrop-blur-sm p-4">
                    <KBarAnimator className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl glass pt-4">
                        <div className="px-4 pb-4 flex items-center gap-3 border-b border-white/5">
                            <Search className="w-5 h-5 text-white/40" />
                            <KBarSearch className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-white/20" />
                        </div>
                        <RenderResults />
                    </KBarAnimator>
                </KBarPositioner>
            </KBarPortal>
            {children}
        </>
    );
};

function RenderResults() {
    const { results } = useMatches();

    return (
        <KBarResults
            items={results}
            onRender={({ item, active }: { item: any, active: boolean }) =>
                typeof item === "string" ? (
                    <div className="px-4 py-2 text-xs font-bold text-white/30 uppercase tracking-widest">{item}</div>
                ) : (
                    <div
                        className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${active ? "bg-primary-500/20 text-white" : "text-white/60"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="font-medium text-base">{(item as Action).name}</span>
                        </div>
                        {item.shortcut?.length && (
                            <div className="flex gap-1">
                                {item.shortcut.map((sc: string) => (
                                    <kbd key={sc} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/40">
                                        {sc}
                                    </kbd>
                                ))}
                            </div>
                        )}
                    </div>
                )
            }
        />
    );
}
