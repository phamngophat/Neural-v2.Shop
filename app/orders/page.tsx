"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { OrderCard } from "@/components/OrderCard";

export default function OrdersPage() {
    const supabase = createClient();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                window.location.href = "/login";
                return;
            }

            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setOrders(data);
            }
            setIsLoading(false);
        };

        fetchOrders();
    }, []);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;

    return (
        <main className="min-h-screen bg-[#F8F9FD] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-neutral-900">Order History</h1>
                        <p className="text-neutral-500">View your past purchases</p>
                    </div>
                    <Button variant="outline" asChild className="rounded-full gap-2">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Shop
                        </Link>
                    </Button>
                </div>

                {orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-neutral-100">
                        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-neutral-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-2">No orders yet</h2>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                            When you place an order, it will appear here.
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
