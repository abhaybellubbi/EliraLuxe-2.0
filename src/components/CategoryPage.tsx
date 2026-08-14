import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProductsSafe, getContentSettingsSafe } from "@/lib/api";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/components/ProductCard";

type Props = {
  category: Product["category"];
  eyebrow: string;
  title: string;
  description: string;
};

const CATEGORY_MAP: Record<string, { to: string; label: string }> = {
  "Chain Pendants": { to: "/shop/chain-pendants", label: "Chain Pendants" },
  Earrings: { to: "/shop/earrings", label: "Earrings" },
  "Chain Bracelets": { to: "/shop/chain-bracelets", label: "Chain Bracelets" },
  "Openable Kada": { to: "/shop/openable-kada", label: "Openable Kada" },
  Rings: { to: "/shop/rings", label: "Finger Rings" },
  Mangalsutra: { to: "/shop/mangalsutra", label: "Mangalsutra" },
  Bangles: { to: "/shop/bangles", label: "Traditional Bangles" },
  Anklets: { to: "/shop/anklets", label: "Anklets" },
};

export function CategoryPage({ category, eyebrow, title, description }: Props) {
  const { data: dbProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsSafe(),
    retry: false,
  });

  const {
    data: settings = {
      featuredCollections: ["Chain Pendants", "Earrings", "Openable Kada", "Rings"],
    },
  } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettingsSafe(),
    retry: false,
  });

  const featuredCollections = settings.featuredCollections || [
    "Chain Pendants",
    "Earrings",
    "Openable Kada",
    "Rings",
  ];

  const list = dbProducts.filter((p: any) => p.category === category);
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-background to-secondary" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center animate-fade-in">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-3">{eyebrow}</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">{title}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {featuredCollections
              .map((cat) => CATEGORY_MAP[cat])
              .filter((n): n is { to: string; label: string } => !!n)
              .map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="px-5 py-2 rounded-full text-sm border border-border hover:border-gold transition"
                  activeProps={{
                    className: "bg-gradient-gold text-primary-foreground border-transparent",
                  }}
                >
                  {n.label}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
