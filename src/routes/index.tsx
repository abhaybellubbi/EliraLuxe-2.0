import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { InstagramStatus } from "@/components/InstagramStatus";
import { UniqueStylesSection } from "@/components/UniqueStylesSection";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getPromotions, getContentSettings } from "@/lib/api";
import heroImage from "@/assets/marketing-hero-3d.png";
import { ShieldCheck, Sparkles, Waves, Gem, ArrowRight, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Elira Luxe — Demi-Fine Jewellery | Unique Styles & Trending Looks" },
      {
        name: "description",
        content:
          "Illuminate Your Elegance. Explore Unique Styles, Instagram Live Status stories, and Trending Looks in premium surgical stainless steel jewellery.",
      },
      { property: "og:title", content: "Elira Luxe — Demi-Fine Jewellery" },
      {
        property: "og:description",
        content:
          "Illuminate Your Elegance. Premium surgical stainless steel jewellery, water & tarnish resistant, built for everyday wear.",
      },
      { name: "twitter:title", content: "Elira Luxe — Demi-Fine Jewellery" },
      {
        name: "twitter:description",
        content:
          "Illuminate Your Elegance. Premium surgical stainless steel jewellery, water & tarnish resistant, built for everyday wear.",
      },
    ],
  }),
});

function Index() {
  const { data: dbProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const { data: dbPromotions = [] } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  });

  const {
    data: settings = {
      heroTitle: "Illuminate",
      heroSubtitle: "Your Elegance",
      heroTagline:
        "Heirloom-worthy pieces in premium surgical stainless steel — water resistant, tarnish proof, and made for every day.",
      aboutText: "",
      contactEmail: "ayeshachinnur@gmail.com",
      contactPhone: "+91 82174 56264",
      contactWhatsapp: "918217456264",
      contactWhatsappCommunity: "https://chat.whatsapp.com/E7J2Ow2RFVcCbJI5huTemq",
      featuredCollections: ["Chain Pendants", "Earrings", "Openable Kada", "Rings"],
    },
  } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettings(),
  });

  const promosList = Array.isArray(dbPromotions) ? dbPromotions : [];
  const activePromos = promosList.filter((p: any) => {
    if (!p) return false;
    const isExplicitlyActive = p.active === true || p.active === "true";
    if (!isExplicitlyActive) return false;
    const now = Date.now();
    if (p.startTime) {
      const startTimeMs = new Date(p.startTime).getTime();
      if (!isNaN(startTimeMs) && startTimeMs > now) return false;
    }
    if (p.endTime) {
      const endTimeMs = new Date(p.endTime).getTime();
      if (!isNaN(endTimeMs) && endTimeMs <= now) return false;
    }
    return true;
  });

  // Show active products first (limit to 6)
  const productsList = Array.isArray(dbProducts) ? dbProducts : [];
  const featured = productsList.filter((p: any) => p && p.stockStatus !== "out_of_stock").slice(0, 6);

  return (
    <SiteLayout>
      {/* Active Promotion Bar */}
      {activePromos.length > 0 && (
        <div className="w-full bg-gradient-gold text-primary-foreground py-2.5 px-4 text-center text-xs font-semibold uppercase tracking-[0.2em] relative z-10 shadow-sm animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
            {activePromos.map((promo: any) => (
              <span key={promo.id} className="inline-flex items-center gap-2">
                <span>✦</span>
                <span>
                  {promo.title}: {promo.description}
                  {promo.code ? ` (CODE: ${promo.code})` : ""}
                </span>
                {promo.type === "flash_sale" && promo.endTime && (
                  <span className="bg-ink/30 text-cream px-2 py-0.5 rounded text-[10px]">
                    Flash Sale
                  </span>
                )}
              </span>
            ))}
            <span>✦</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-background to-secondary" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <p className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-6 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-deep animate-spin" style={{ animationDuration: "12s" }} />
              Demi-Fine Jewellery · Est. 2025
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-foreground mb-4">
              {settings.heroTitle} <br />
              <span className="font-script shimmer-gold text-6xl md:text-8xl leading-[1.3] inline-block pb-4 pr-2">
                {settings.heroSubtitle}
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-md mb-8 font-medium leading-relaxed">
              {settings.heroTagline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-8 py-3.5 rounded-full bg-gradient-gold text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-xl shadow-gold/30 hover:scale-[1.03] active:scale-95 transition-all duration-300"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 rounded-full border border-foreground/20 text-foreground font-bold text-xs uppercase tracking-wider hover:border-gold hover:text-gold-deep transition-all duration-300"
              >
                Our Story
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md border-t border-border/80 pt-6">
              {[
                { k: "100%", v: "Surgical Steel" },
                { k: "0", v: "Tarnish Guarantee" },
                { k: "24/7", v: "Hydro Wearable" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-2xl md:text-3xl text-gradient-gold font-bold">
                    {s.k}
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-0.5">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute -inset-6 rounded-full bg-gradient-gold opacity-20 blur-3xl animate-pulse" />
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl shadow-gold/20 animate-float">
              <img
                src={heroImage}
                alt="Featured jewellery"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Promise strip */}
      <section className="border-y border-border bg-cream dark:bg-secondary">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            "Premium 316L Surgical Steel",
            "100% Water & Gym Resistant",
            "Lifetime Anti-Tarnish Guarantee",
            "Affordable Luxury Demi-Fine",
          ].map((t) => (
            <div key={t} className="text-xs uppercase font-bold tracking-wider text-foreground/90 flex items-center justify-center gap-2">
              <span className="text-gold-deep font-display text-lg">✦</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. INSTAGRAM STATUS & STORIES FEED */}
      {settings.showInstagramStatus !== false && (
        <div id="instagram-status">
          <InstagramStatus />
        </div>
      )}

      {/* Featured Pieces Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-2 font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-deep" />
              Curated Masterpieces
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Featured Pieces</h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-gold-deep hover:underline"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 1. UNIQUE & INNOVATIVE STYLES SECTION */}
      {settings.showUniqueStyles !== false && (
        <div id="unique-styles">
          <UniqueStylesSection />
        </div>
      )}

      {/* 3. MATERIAL CRAFT & ENGINEERING SHOWCASE */}
      <section className="py-20 bg-secondary/30 border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-3 font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-deep" />
              Engineering Excellence
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Why <span className="font-script shimmer-gold text-5xl md:text-6xl">Elira Luxe</span> Is Different
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium mt-3">
              Traditional fashion jewelry tarnishes within days. Our demi-fine surgical steel pieces are engineered for life.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-card border border-border hover:border-gold transition-all duration-300 shadow-md group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center mb-4 text-gold-deep group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">316L Surgical Steel</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero green skin. 100% nickel-free and hypoallergenic for sensitive skin.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border hover:border-gold transition-all duration-300 shadow-md group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center mb-4 text-gold-deep group-hover:scale-110 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-1xl font-bold text-foreground mb-2">18k PVD Vacuum Gold</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                10x thicker ion bonding layer that resists sweat, seawater, and daily perfume.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border hover:border-gold transition-all duration-300 shadow-md group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center mb-4 text-gold-deep group-hover:scale-110 transition">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Active Hydro-Shield</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Wear while swimming, working out, showering, or traveling with 0% tarnish risk.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border hover:border-gold transition-all duration-300 shadow-md group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center mb-4 text-gold-deep group-hover:scale-110 transition">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">AAA Prism Cut CZ</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                57-facet brilliant precision cut stones providing diamond-grade radiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-10 md:p-16 text-center border border-gold/30 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-deep/20 via-transparent to-gold/20" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="font-script shimmer-gold text-4xl md:text-5xl mb-3">Elira Luxe Concierge</p>
            <h3 className="font-display text-3xl md:text-4xl text-white font-bold mb-4 drop-shadow-md">
              Need Personal Styling or Custom Stack Advice?
            </h3>
            <p className="text-white/80 text-xs md:text-sm font-medium mb-8 leading-relaxed">
              Reach out directly for bespoke styling recommendations, bulk orders, or custom stack requests.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/918217456264?text=${encodeURIComponent(
                  "Hi Elira Luxe! I am visiting your site and would like styling recommendations."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-gold text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with VIP Stylist on WhatsApp</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/30 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition"
              >
                <span>Contact Channels</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
