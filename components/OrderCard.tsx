"use client";

import { Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

export interface OrderCardProps {
    order: {
        id: string;
        user_id: string;
        total_price: number;
        items: OrderItem[];
        status: string;
        created_at: string;
    }
}

export function OrderCard({ order }: OrderCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm font-medium text-neutral-900">
                            {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                <div className="pl-13 space-y-2">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span className="text-neutral-600">{item.quantity}x {item.name}</span>
                            <span className="font-medium text-neutral-900">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="md:border-l md:border-neutral-100 md:pl-6 flex flex-col justify-center items-end">
                <p className="text-sm text-neutral-500 mb-1">Total</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(order.total_price)}</p>
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${order.status === "Pending" ? "bg-amber-50 text-amber-700" :
                    order.status === "Processing" ? "bg-blue-50 text-blue-700" :
                        order.status === "Cancelled" ? "bg-red-50 text-red-700" :
                            "bg-green-50 text-green-700" // Default Completed
                    }`}>
                    {order.status || "Processing"}
                </span>
            </div>
        </div>
    );
}
