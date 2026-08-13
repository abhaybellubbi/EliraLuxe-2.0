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
  TrendingUp,
  Clock,
  Sparkles,
  Users,
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
  const limitedStockProducts = products.filter((p: any) => p.stockStatus === "limited_stock");

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
      label: "Active Products",
      value: activeProducts,
      icon: ShoppingBag,
      color: "text-green-400 bg-green-500/10 border-green-500/20",
    },
    {
      label: "Out of Stock",
      value: outOfStockProducts,
      icon: AlertTriangle,
      color:
        outOfStockProducts > 0
          ? "text-red-400 bg-red-500/10 border-red-500/20"
          : "text-cream/40 bg-white/5 border-white/10",
    },
    {
      label: "Active Promos",
      value: activePromotions,
      icon: Tag,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "WhatsApp Enquiries",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-wide">Overview</h1>
        <p className="text-muted-foreground text-sm">
          Real-time summaries of your Elira Luxe inventory, offers, and WhatsApp enquiries.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-6 rounded-2xl bg-[#121215] border border-gold/5 flex flex-col justify-between min-h-[140px] shadow-lg`}
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

      {/* Recent Enquiries & Orders */}
      <div className="bg-[#121215] border border-gold/10 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-gold/10 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <h2 className="font-display text-xl font-semibold">Recent WhatsApp Enquiries</h2>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs text-gold hover:text-gold-light flex items-center gap-1 transition"
          >
            <span>View All ({totalOrders})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-gold/20" />
            <span>
              No enquiries logged yet. They will appear here when customers click "Enquire on
              WhatsApp".
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold/10 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 font-semibold">Customer</th>
                  <th className="py-3 font-semibold">Product</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Logged At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5 text-sm">
                {orders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5">
                      <div className="font-medium text-cream">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.customerPhone || "No phone"}
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-foreground">{order.productName}</td>

                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                          order.status === "completed"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : order.status === "cancelled"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
