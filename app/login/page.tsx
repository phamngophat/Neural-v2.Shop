"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/AuthForm";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push("/"); // Redirect logically to home if already logged in
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FD]">
      {/* Background blobs for color */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-pink-200/40 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-[450px] border-none shadow-2xl bg-white/80 backdrop-blur-xl relative z-10 rounded-3xl p-8 sm:p-12">
        <AuthForm type="login" />
      </Card>
    </main>
  );
}
