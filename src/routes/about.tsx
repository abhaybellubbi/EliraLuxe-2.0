import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import logo from "@/assets/logo.png";
import reviewRupa from "@/assets/review-rupa.jpg";
import reviewSalma from "@/assets/review-salma.jpg";
import reviewSarah from "@/assets/review-sarah.jpg";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";
import { ShieldCheck, Sparkles, Waves, Gem, CheckCircle2, Heart } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getContentSettingsSafe } from "@/lib/api";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Us — Elira Luxe" },
      {
        name: "description",
        content:
          "Learn about Elira Luxe — high-lustre demi-fine jewellery in 316L surgical stainless steel & 18k PVD gold plating. Built for everyday luxury.",
      },
      { property: "og:title", content: "About Us — Elira Luxe" },
      {
        property: "og:description",
        content:
          "Learn about Elira Luxe — high-lustre demi-fine jewellery in 316L surgical stainless steel & 18k PVD gold plating. Built for everyday luxury.",
      },
      { name: "twitter:title", content: "About Us — Elira Luxe" },
      {
        name: "twitter:description",
        content:
          "Learn about Elira Luxe — high-lustre demi-fine jewellery in 316L surgical stainless steel & 18k PVD gold plating. Built for everyday luxury.",
      },
    ],
  }),
});

function About() {
  const {
    data: settings = {
      aboutText:
        "Elira Luxe was founded in 2025 with one belief — fine-looking jewellery shouldn't be reserved for special occasions. Every piece is crafted in premium surgical stainless steel, finished by hand, and engineered to stay flawless through showers, workouts, and everyday wear.",
    },
  } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettingsSafe(),
    retry: false,
  });

  return (
    <SiteLayout>
      <section className="max-w-5xl mx-auto px-6 py-20 text-center animate-fade-up">
        <img
          src={logo}
          alt="Elira Luxe"
          className="h-28 w-28 mx-auto mb-6 object-contain animate-float"
        />
        <p className="font-script shimmer-gold text-4xl mb-4">Our Story</p>
        <h1 className="font-display text-5xl md:text-6xl mb-6">
          Affordable luxury, built to last.
        </h1>
        <p className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-4">Established 2025</p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {settings.aboutText}
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { k: "2025", v: "Founded" },
            { k: "100%", v: "Surgical Steel" },
            { k: "1K+", v: "Happy Clients" },
            { k: "5★", v: "Average Rating" },
          ].map((s, i) => (
            <div
              key={s.v}
              className="p-6 rounded-2xl border border-border bg-card animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="font-display text-3xl text-gradient-gold font-semibold">{s.k}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-6">
        {[
          {
            t: "Surgical Steel",
            d: "Hypoallergenic, skin-safe and incredibly strong — the same grade trusted in medical tools.",
          },
          { t: "Water Resistant", d: "Swim, shower, sweat. Our finish doesn't flinch." },
          {
            t: "Tarnish Proof",
            d: "Keeps its shine for years, not weeks. No replating, no fading.",
          },
        ].map((f, i) => (
          <div
            key={f.t}
            className="p-8 rounded-2xl border border-border bg-card hover:border-gold hover:-translate-y-1 transition-all duration-500 animate-fade-up"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="text-gold-deep text-3xl font-display mb-3">✦</div>
            <h3 className="font-display text-2xl mb-2">{f.t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-3">Our Mission</p>
            <h2 className="font-display text-4xl mb-4">Jewellery worth wearing every day.</h2>
            <p className="text-muted-foreground leading-relaxed">
              We design pieces that earn a permanent spot in your daily ritual — pieces that travel
              with you, take a beating, and still catch the light at sunset. No drawer-only
              heirlooms. Just quiet, modern luxury you actually live in.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Hand-finished", "PVD gold plated", "Lifetime polish", "Free shipping"].map((b) => (
              <div
                key={b}
                className="p-5 rounded-xl border border-border bg-card text-center hover:border-gold transition"
              >
                <div className="text-gold-deep font-display text-xl">✦</div>
                <div className="text-sm mt-1">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-3">Loved by</p>
          <h2 className="font-display text-4xl">What our clients say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              q: "I've worn the bangle in the shower for 3 months — still looks brand new.",
              n: "Rupa Bennur",
              img: reviewRupa,
            },
            {
              q: "Genuinely the most comfortable everyday earrings I own.",
              n: "Salma Parvez",
              img: reviewSalma,
            },
            {
              q: "Looks like real gold but at a fraction of the cost. Obsessed.",
              n: "Sarah Desai",
              img: reviewSarah,
            },
          ].map((t, i) => (
            <figure
              key={t.n}
              className="p-8 rounded-2xl border border-border bg-card animate-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.img}
                  alt={t.n}
                  className="h-12 w-12 rounded-full object-cover border border-gold/40"
                />
                <div>
                  <div className="text-sm font-medium">{t.n}</div>
                  <div className="text-gold text-xs">★★★★★</div>
                </div>
              </div>
              <blockquote className="text-foreground/90 italic font-display text-lg leading-relaxed">
                "{t.q}"
              </blockquote>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="font-script shimmer-gold text-3xl mb-3">Illuminate Your Elegance</p>
          <p className="text-cream/70 text-lg">Because everyday is worth dressing up for.</p>
        </div>
      </section>
    </SiteLayout>
  );
}
