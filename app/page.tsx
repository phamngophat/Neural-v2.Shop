"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { PRODUCTS } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ, Filter } from "lucide-react";

// Separate component to use useSearchParams inside Suspense (Good practice for Next.js)
function ProductContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      window.location.href = "/login";
    } else {
      setIsLoading(false);
    }
  }, []);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    // 1. Search
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery)
      );
    }

    // 2. Category Filter
    if (activeFilter === "All") {
      // Show all
    } else if (["AI Tools", "Game Services", "Social Media"].includes(activeFilter)) {
      result = result.filter(p => p.category === activeFilter);
    } else if (activeFilter === "Dưới 100k") {
      result = result.filter(p => p.price < 100000);
    } else if (activeFilter === "Premium") {
      result = result.filter(p => p.price >= 200000); // Updated premium threshold
    }

    // 3. Sort
    result = [...result].sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

    return result;
  }, [searchQuery, activeFilter, sortOrder]);

  // Cart Logic
  const handleAddToCart = (product: Product, quantity: number) => {
    // Import helper directly
    addToCart(product, quantity);

    // Create a temporary toast notification manually since we don't have a toast library installed
    const toast = document.createElement("div");
    toast.className = "fixed bottom-8 right-8 bg-neutral-900 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300";
    toast.innerHTML = `
      <div class="bg-green-500 rounded-full p-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-900"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div>
        <p class="font-bold text-sm">Added to cart</p>
        <p class="text-xs text-neutral-400">${quantity} x ${product.name}</p>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("animate-out", "fade-out", "slide-out-to-bottom-5", "duration-300");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          NeuralShop
        </h1>
        <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          Unlock the full potential of AI and Creativity tools.
          Premium accounts for ChatGPT, Gemini, Cursor, and more.
        </p>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Button variant={activeFilter === "All" ? "default" : "ghost"} onClick={() => setActiveFilter("All")} className="rounded-full">All</Button>
          <Button variant={activeFilter === "AI Tools" ? "default" : "ghost"} onClick={() => setActiveFilter("AI Tools")} className="rounded-full">AI Tools</Button>
          <Button variant={activeFilter === "Game Services" ? "default" : "ghost"} onClick={() => setActiveFilter("Game Services")} className="rounded-full">Games</Button>
          <Button variant={activeFilter === "Social Media" ? "default" : "ghost"} onClick={() => setActiveFilter("Social Media")} className="rounded-full">Social</Button>
          <div className="w-px h-6 bg-neutral-200 mx-2" />
          <Button variant={activeFilter === "Dưới 100k" ? "default" : "ghost"} onClick={() => setActiveFilter("Dưới 100k")} className="rounded-full">Dưới 100k</Button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm text-neutral-500 hidden sm:inline">Sort by Price:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            className="gap-2 rounded-full border-neutral-200"
          >
            {sortOrder === "asc" ? <ArrowDownAZ className="w-4 h-4" /> : <ArrowUpAZ className="w-4 h-4" />}
            {sortOrder === "asc" ? "Low to High" : "High to Low"}
          </Button>
        </div>
      </div >

      {/* Results-Aware Heading */}
      {
        searchQuery && (
          <p className="mb-6 text-neutral-500">
            Found {filteredProducts.length} results for "<span className="font-bold text-neutral-900">{searchQuery}</span>"
          </p>
        )
      }

      {/* Grid with Cart Handler */}
      {
        filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="text-6xl">🔍</div>
            <h3 className="text-xl font-medium text-neutral-900">No products found for "{searchQuery}"</h3>
            <p className="text-neutral-500">Try checking your spelling or use different keywords.</p>
            <Button variant="outline" onClick={() => { window.location.href = "/"; }} className="rounded-full">
              Clear Search
            </Button>
          </div>
        )
      }
    </main >
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductContent />
    </Suspense>
  );
}
