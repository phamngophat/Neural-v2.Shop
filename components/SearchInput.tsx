"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchInputContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState("");

    // Sync search input with URL
    useEffect(() => {
        setSearchValue(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            router.push(`/?search=${encodeURIComponent(searchValue)}`);
        } else {
            router.push("/");
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
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
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        </form>
    );
}

export function SearchInput() {
    return (
        <Suspense fallback={<div className="w-full h-10 rounded-full bg-neutral-100 animate-pulse" />}>
            <SearchInputContent />
        </Suspense>
    );
}
