"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/CartIcon";
import { SearchInput } from "@/components/SearchInput";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    // Initial session check
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Login", href: "/login", show: !user },
    { label: "Register", href: "/register", show: !user },
  ];

  return (
    <div className="w-full flex justify-center sticky top-4 z-50 px-4">
      <nav className="w-full max-w-7xl rounded-full border border-white/20 bg-white/70 backdrop-blur-xl shadow-lg ring-1 ring-black/5 transition-all">
        <div className="flex h-16 items-center justify-between px-6 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-sm transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="NeuralShop Logo" className="object-cover w-full h-full" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hidden sm:block">
              NeuralShop
            </span>
          </Link>

          {/* Search Bar - Visible to all */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchInput />
          </div>

          {/* Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart - Visible to all */}
            <CartIcon />

            {!user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="hidden sm:inline-flex rounded-full">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="rounded-full bg-neutral-900 text-white px-6">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild className="hidden sm:inline-flex rounded-full text-neutral-600 hover:text-neutral-900">
                  <Link href="/orders">Orders</Link>
                </Button>
                <span className="text-sm font-medium hidden lg:block text-neutral-700">Hi, {user.user_metadata?.full_name || user.email?.split("@")[0]}</span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 font-medium px-4"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
