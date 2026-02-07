"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/CartIcon";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");

  // Sync search input with URL
  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    // Check user function
    const checkUser = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const storedUser = localStorage.getItem("currentUser");
      if (isLoggedIn && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkUser();

    // Listeners
    window.addEventListener('authUpdated', checkUser);

    return () => {
      window.removeEventListener('authUpdated', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setUser(null);
    window.location.href = "/login";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?search=${encodeURIComponent(searchValue)}`);
    } else {
      router.push("/");
    }
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

          {/* Search Bar */}
          {/* Search Bar - Only for logged in users */}
          {user && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex items-center relative">
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full rounded-full bg-white/50 border-neutral-200 pl-10 focus-visible:ring-indigo-500"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (e.target.value === "") router.push("/");
                }}
              />
              <Search className="absolute left-3.5 w-4 h-4 text-neutral-500" />
            </form>
          )}

          {/* Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart */}
            {/* Cart - Only for logged in users */}
            {user && (
              <CartIcon />
            )}

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
                <span className="text-sm font-medium hidden lg:block">Hi, {user.fullname}</span>
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
