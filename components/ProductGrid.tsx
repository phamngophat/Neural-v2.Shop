import { ProductCard } from "./ProductCard";
import { Product } from "@/lib/types";

interface ProductGridProps {
    products: Product[];
    onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}
