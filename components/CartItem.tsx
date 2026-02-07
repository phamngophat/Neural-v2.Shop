import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/cart";
import { formatCurrency } from "@/lib/utils";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-neutral-100">
            {/* Image */}
            <div className="relative w-24 h-24 shrink-0 bg-neutral-50 rounded-xl overflow-hidden p-2">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                <p className="text-indigo-600 font-bold">{formatCurrency(item.price)}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-white hover:shadow-sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-white hover:shadow-sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onRemove(item.id)}
                >
                    <Trash2 className="w-5 h-5" />
                </Button>
            </div>

            {/* Subtotal (Desktop only) */}
            <div className="hidden sm:block w-32 text-right font-bold text-neutral-900">
                {formatCurrency(item.price * item.quantity)}
            </div>
        </div>
    );
}
