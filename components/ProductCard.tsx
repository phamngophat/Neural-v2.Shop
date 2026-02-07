import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <Card className="overflow-hidden rounded-2xl border-none shadow-md transition-all hover:shadow-xl group hover:-translate-y-1 bg-white/50 backdrop-blur-sm flex flex-col h-full">
            <CardHeader className="p-0">
                <div className="relative aspect-video overflow-hidden bg-neutral-100 flex items-center justify-center">
                    <div className="relative w-full h-full p-8">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 flex-1">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-neutral-900 line-clamp-1">
                        {product.name}
                    </CardTitle>
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg text-sm">
                        {formatCurrency(product.price)}
                    </span>
                </div>
                <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>
            </CardContent>
            <CardFooter className="p-5 pt-0 flex gap-3">
                <div className="flex items-center bg-neutral-100 rounded-xl p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                    >
                        -
                    </Button>
                    <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={handleIncrement}
                    >
                        +
                    </Button>
                </div>
                <Button
                    onClick={() => onAddToCart(product, quantity)}
                    className="flex-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-500/20 active:scale-95 transition-transform"
                >
                    Add
                </Button>
            </CardFooter>
        </Card>
    );
}
