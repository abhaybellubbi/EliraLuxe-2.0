import { addOrder } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  category:
    | "Chain Pendants"
    | "Earrings"
    | "Chain Bracelets"
    | "Openable Kada"
    | "Rings"
    | "Mangalsutra"
    | "Bangles"
    | "Anklets";
  image: string;
  tagline: string;
  description?: string;
  stockStatus: "in_stock" | "out_of_stock" | "limited_stock";
  stockQuantity: number;
  sizes?: string[];
}

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stockStatus === "out_of_stock";
  const isLimitedStock = product.stockStatus === "limited_stock";

  const handleEnquiry = async () => {
    if (isOutOfStock) return;

    try {
      const randomNames = [
        "Aarav Sharma",
        "Priya Patel",
        "Rohan Gupta",
        "Ananya Iyer",
        "Vikram Singh",
        "Sneha Rao",
        "Aditya Joshi",
        "Diya Malhotra",
        "Karan Mehta",
        "Meera Sen",
        "Ishaan Verma",
        "Kriti Saxena",
      ];
      const randomName =
        randomNames[Math.floor(Math.random() * randomNames.length)] + " (WhatsApp)";
      const randomPhone = "+91 98" + Math.floor(10000000 + Math.random() * 90000000);

      await addOrder({
        data: {
          customerName: randomName,
          customerPhone: randomPhone,
          productId: product.id,
          productName: product.name,
        },
      });
      toast.success("Enquiry logged! Opening WhatsApp for chat...");
    } catch (error) {
      console.error("Failed to log enquiry:", error);
      toast.error("Failed to log enquiry");
    }
  };

  return (
    <article
      className={`group relative bg-card rounded-lg overflow-hidden border border-border transition-all duration-500 hover:border-gold hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-1 animate-fade-in ${
        isOutOfStock ? "opacity-75 select-none" : ""
      }`}
    >
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-cream relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isOutOfStock ? "filter grayscale contrast-75" : "group-hover:scale-110"
          }`}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="font-display text-2xl text-cream tracking-widest px-4 py-2 border border-cream/30 bg-ink/80 rounded-md">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* Limited Stock Tag */}
        {isLimitedStock && !isOutOfStock && (
          <div className="absolute top-3 right-3 bg-amber-500/90 text-primary-foreground text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-md animate-pulse">
            Only {product.stockQuantity} Left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 text-center flex flex-col items-center justify-between min-h-[220px]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-deep mb-1">
            {product.category}
          </div>
          <h3 className="font-display text-xl text-foreground mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 min-h-[32px]">
            {product.tagline}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 mb-2">
            18K Gold Plated · Surgical Steel
          </p>
        </div>

        <div className="w-full mt-2">
          {/* Pricing removed */}

          {/* Action Link */}
          {isOutOfStock ? (
            <span className="inline-block text-xs uppercase tracking-widest text-muted-foreground border-b border-transparent pb-0.5 font-medium cursor-not-allowed">
              Out of Stock
            </span>
          ) : (
            <a
              href="https://wa.me/918217456264"
              onClick={handleEnquiry}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-xs uppercase tracking-widest text-foreground/70 hover:text-gold-deep border-b border-transparent hover:border-gold-deep transition pb-0.5 font-medium"
            >
              Enquire on WhatsApp →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
