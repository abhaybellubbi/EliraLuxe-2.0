import { addOrder } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

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
      toast.success(`Enquiry logged for "${product.name}"! Opening WhatsApp...`);
    } catch (error) {
      console.error("Failed to log enquiry:", error);
      toast.error("Failed to log enquiry");
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Elira Luxe! ✨ I would like to enquire about "${product.name}" (${product.category}). Tagline: "${product.tagline}". Please share pricing & availability.`
  );
  const whatsappUrl = `https://wa.me/918217456264?text=${whatsappMessage}`;

  return (
    <article
      className={`group relative bg-card rounded-2xl overflow-hidden border border-border transition-all duration-500 hover:border-gold hover:shadow-2xl hover:shadow-gold/15 hover:-translate-y-1 animate-fade-in flex flex-col justify-between ${
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
          <div className="absolute top-3 right-3 bg-amber-500/90 text-primary-foreground text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
            Only {product.stockQuantity} Left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 text-center flex flex-col items-center justify-between flex-1 space-y-3">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold-deep mb-1">
            {product.category}
          </div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 min-h-[32px]">
            {product.tagline}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/70 mb-1">
            18K Gold Plated · Surgical Steel
          </p>
        </div>

        <div className="w-full pt-1">
          {isOutOfStock ? (
            <span className="inline-block w-full py-2.5 rounded-full bg-secondary text-muted-foreground text-xs uppercase tracking-widest font-bold cursor-not-allowed border border-border">
              Out of Stock
            </span>
          ) : (
            <a
              href={whatsappUrl}
              onClick={handleEnquiry}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Enquire on WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
