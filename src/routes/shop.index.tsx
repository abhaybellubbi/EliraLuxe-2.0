import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getContentSettings } from "@/lib/api";

export const Route = createFileRoute("/shop/")({
  component: Shop,
  head: () => ({
    meta: [
      { title: "Collection — Elira Luxe" },
      {
        name: "description",
        content:
          "Browse the full Elira Luxe collection of chain pendants, earrings and chain bracelets in premium surgical stainless steel.",
      },
      { property: "og:title", content: "Collection — Elira Luxe" },
      {
        property: "og:description",
        content:
          "Browse the full Elira Luxe collection of chain pendants, earrings and chain bracelets in premium surgical stainless steel.",
      },
      { name: "twitter:title", content: "Collection — Elira Luxe" },
      {
        name: "twitter:description",
        content:
          "Browse the full Elira Luxe collection of chain pendants, earrings and chain bracelets in premium surgical stainless steel.",
      },
    ],
  }),
});

function Shop() {
  const { data: dbProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const {
    data: settings = {
      featuredCollections: ["Chain Pendants", "Earrings", "Openable Kada", "Rings"],
    },
  } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettings(),
  });

  const featuredCollections = settings.featuredCollections || [
    "Chain Pendants",
    "Earrings",
    "Openable Kada",
    "Rings",
  ];
  const cats = ["All", ...featuredCollections];

  const [cat, setCat] = useState<string>("All");
  const list = cat === "All" ? dbProducts : dbProducts.filter((p: any) => p.category === cat);

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-3">The Collection</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Crafted to Glow</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore chain pendants, earrings and chain bracelets — each in surgical stainless steel,
            finished to last.
          </p>
        </div>
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-sm tracking-wide border transition ${cat === c ? "bg-gradient-gold text-primary-foreground border-transparent" : "border-border text-foreground/70 hover:border-gold"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
