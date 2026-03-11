"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function ChatButton() {
    const pathname = usePathname();

    // Hide on chat page since user is already in chat
    if (pathname === "/chat") return null;

    return (
        <Link
            href="/chat"
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Mở hỗ trợ trực tuyến"
        >
            <div className="relative">
                <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></span>
                <div className="relative flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold hidden sm:inline">Hỗ trợ</span>
                </div>
            </div>
        </Link>
    );
}
