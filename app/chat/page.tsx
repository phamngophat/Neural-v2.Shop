"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ChatInterface } from "@/components/ChatInterface";
import Link from "next/link";
import { ChevronLeft, LogOut, ShieldCheck } from "lucide-react";

export default function ChatPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace("/login");
                return;
            }
            setUser(session.user);
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="mt-4 text-slate-500 font-medium tracking-wide animate-pulse">Khởi động AI Assistant...</span>
            </div>
        );
    }

    if (!user) return null;

    const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Khách";
    const userEmail = user.email;

    return (
        <div className="h-screen w-full flex flex-col bg-slate-50/50">
            {/* ─── Premium Application Header ─── */}
            <header className="flex-none h-[72px] bg-white border-b border-indigo-100/50 px-6 flex items-center justify-between shadow-sm z-10">
                {/* Left: Back Button & Context */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors py-2 px-3 hover:bg-indigo-50 rounded-lg group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Quay lại mua sắm</span>
                    </Link>

                    <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-slate-200">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg shadow-sm">
                            <img src="/logo.png" alt="NeuralShop" className="w-5 h-5 object-contain brightness-0 invert" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                                Neural Workspace
                            </h1>
                            <p className="text-[11px] font-medium text-slate-400">Powered by Google Gemini Pro</p>
                        </div>
                    </div>
                </div>

                {/* Right: User Menu */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                            {userName}
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{userEmail}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-violet-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold uppercase overflow-hidden ring-2 ring-indigo-500/10">
                        {user.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                            userName.charAt(0)
                        )}
                    </div>
                    <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block"></div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Đăng xuất"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* ─── Chat Container ─── */}
            <main className="flex-1 overflow-hidden relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none -z-10"></div>

                <div className="h-full w-full max-w-5xl mx-auto md:px-6 md:py-6">
                    <div className="bg-white h-full w-full md:rounded-2xl shadow-xl shadow-indigo-100/20 border border-slate-100 overflow-hidden flex flex-col">
                        <ChatInterface userId={user.id} userName={userName} />
                    </div>
                </div>
            </main>
        </div>
    );
}
