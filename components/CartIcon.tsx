"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function CartIcon() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Helper to update count safely
        const updateCount = () => {
            // Dynamic import or check window to be safe/consistent with other parts
            // Assuming getCartCount is available or we replicate logic
            try {
                const { getCartCount } = require("@/lib/cart");
                setCartCount(getCartCount());
            } catch (e) {
                console.error("Cart error", e);
            }
        };

        updateCount();

        const handleCartUpdate = () => updateCount();
        window.addEventListener("cartUpdated", handleCartUpdate);

        // Also listen for storage events to sync across tabs if needed, 
        // though the requirement mainly focuses on reload/local usage

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, []);

    if (cartCount === 0) {
        // Still show icon but maybe no badge, or just button
        // Requirement: "Biểu tượng giỏ hàng phải hiển thị tổng số sản phẩm đã thêm"
        // If 0, usually just icon.
    }

    return (
        <Button variant="ghost" size="icon" className="relative rounded-full text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50" asChild>
            <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm animate-in zoom-in spin-in-12 duration-300">
                        {cartCount}
                    </span>
                )}
            </Link>
        </Button>
    );
}
