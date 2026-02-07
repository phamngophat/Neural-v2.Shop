"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/CartItem";
import { getCart, removeFromCart, updateQuantity, getCartTotal, CartItem as CartItemType } from "@/lib/cart";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const refreshCart = () => {
        setCartItems(getCart());
        setTotal(getCartTotal());
    };

    useEffect(() => {
        refreshCart();
        setIsLoaded(true);

        const handleCartUpdate = () => refreshCart();
        window.addEventListener("cartUpdated", handleCartUpdate);
        return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }, []);

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-[#F8F9FD] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-neutral-900">Shopping Cart</h1>
                        <p className="text-neutral-500">Manage your selected items</p>
                    </div>
                    <Button variant="outline" asChild className="rounded-full gap-2">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 sticky top-24">
                                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">{formatCurrency(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-neutral-100 pt-3 flex justify-between text-lg font-bold text-neutral-900">
                                        <span>Total</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                </div>
                                <Button className="w-full h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-500/20 font-semibold gap-2">
                                    <ShoppingBag className="w-4 h-4" />
                                    Checkout
                                </Button>
                                <p className="text-xs text-center text-neutral-400 mt-4">
                                    Secure Checkout - SSL Encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-neutral-100">
                        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-neutral-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Button asChild className="rounded-full px-8 py-6 h-auto text-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 shadow-xl">
                            <Link href="/">
                                Start Shopping
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
