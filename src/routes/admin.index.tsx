import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getPromotions, getOrders } from "@/lib/api";
import {
  Package,
  ShoppingBag,
  Tag,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  Gem,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const { data: promotions = [] } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter(
    (p: any) => p.stockStatus === "in_stock" || p.stockStatus === "limited_stock",
  ).length;
  const outOfStockProducts = products.filter((p: any) => p.stockStatus === "out_of_stock").length;

  // Material distinction calculation
  const goldProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes("gold") ||
    p.tagline.toLowerCase().includes("gold") ||
    p.description?.toLowerCase().includes("gold")
  );

  const surgicalSteelProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes("steel") ||
    p.name.toLowerCase().includes("silver") ||
    p.tagline.toLowerCase().includes("steel") ||
    p.description?.toLowerCase().includes("steel") ||
    !p.name.toLowerCase().includes("gold")
  );

  const activePromotions = promotions.filter((p: any) => p.active).length;
  const totalOrders = orders.length;

  // Items requiring attention (out of stock or limited stock)
  const lowStockProducts = products
    .filter(
      (p: any) =>
        p.stockStatus === "out_of_stock" ||
        (p.stockStatus === "limited_stock" && p.stockQuantity <= 3),
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "18k PVD Gold Craft",
      value: goldProducts.length,
      icon: Gem,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "316L Surgical Steel",
      value: surgicalSteelProducts.length,
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Active Promos",
      value: activePromotions,
      icon: Tag,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "WhatsApp Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-wide">Overview Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Real-time summary of inventory, material craftsmanship distinction (18k Gold vs 316L Surgical Steel), and sales.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-6 rounded-2xl bg-[#121215] border border-gold/10 flex flex-col justify-between min-h-[140px] shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg border ${stat.color.split(" ").slice(1).join(" ")}`}>
                <stat.icon className={`h-4 w-4 ${stat.color.split(" ")[0]}`} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-display font-bold text-cream">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Material Distinction Comparison Card */}
      <div className="bg-[#121215] border border-gold/15 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold/10 pb-4 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-gold font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Material Craftsmanship Distinction
            </div>
            <h2 className="font-display text-2xl font-bold text-cream">
              18k PVD Gold Finish vs 316L Surgical Steel
            </h2>
          </div>
          <Link
            to="/admin/products"
            className="text-xs text-gold hover:underline flex items-center gap-1 font-bold"
          >
            <span>Manage Product Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 18k PVD Gold Card */}
          <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-amber-400" />
                <span className="font-display text-lg font-bold text-amber-300">18k PVD Vacuum Gold Plating</span>
              </div>
              <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-400/40">
                {goldProducts.length} Products
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vacuum ion-plated 18k gold layer over 316L steel. Engineered for high shine, luxury warmth, and 100% water & tarnish resistance.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-200/80 font-mono">
              <span>✦ 10x Thicker Ion Coating</span>
              <span>✦ Sweat & Sea Water Safe</span>
            </div>
          </div>

          {/* 316L Surgical Steel Card */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-display text-lg font-bold text-emerald-300">316L Surgical Stainless Steel</span>
              </div>
              <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/40">
                {surgicalSteelProducts.length} Products
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Medical-grade hypoallergenic 316L steel core. Zero green skin, zero rust, indestructible durability for everyday 24/7 wear.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-200/80 font-mono">
              <span>✦ 100% Hypoallergenic</span>
              <span>✦ Zero Nickel & Zero Green Skin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Main Dashboard Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 bg-[#121215] border border-gold/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-gold/10 pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="font-display text-xl font-semibold">Stock Alerts & Low Quantities</h2>
            </div>
            <Link
              to="/admin/products"
              className="text-xs text-gold hover:text-gold-light flex items-center gap-1 transition"
            >
              <span>Manage Inventory</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
              <Sparkles className="h-8 w-8 text-gold/30" />
              <span>All products are well stocked. Excellent!</span>
            </div>
          ) : (
            <div className="divide-y divide-gold/10">
              {lowStockProducts.map((p: any) => (
                <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-10 w-10 rounded object-cover border border-gold/10 bg-cream"
                    />
                    <div>
                      <div className="text-sm font-medium text-cream">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {p.stockStatus === "out_of_stock" ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Only {p.stockQuantity} Left
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-[#121215] border border-gold/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold border-b border-gold/10 pb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              <span>Quick Actions</span>
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="flex items-center justify-between p-3.5 rounded-xl border border-gold/10 hover:border-gold hover:bg-gold/5 text-sm transition"
              >
                <span>Add New Product</span>
                <ArrowRight className="h-4 w-4 text-gold" />
              </Link>
              <Link
                to="/admin/promotions"
                className="flex items-center justify-between p-3.5 rounded-xl border border-gold/10 hover:border-gold hover:bg-gold/5 text-sm transition"
              >
                <span>Create Discount Promo</span>
                <ArrowRight className="h-4 w-4 text-gold" />
              </Link>
              <Link
                to="/admin/content"
                className="flex items-center justify-between p-3.5 rounded-xl border border-gold/10 hover:border-gold hover:bg-gold/5 text-sm transition"
              >
                <span>Customize Homepage</span>
                <ArrowRight className="h-4 w-4 text-gold" />
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gold/10 text-center">
            <div className="text-xs text-muted-foreground mb-3">
              Live WhatsApp Community Connection
            </div>
            <a
              href="https://chat.whatsapp.com/E7J2Ow2RFVcCbJI5huTemq"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-semibold uppercase tracking-wider transition"
            >
              <Users className="h-4 w-4" />
              <span>Join Live Community</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
