import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrdersSafe,
  addOrder,
  getProductsSafe,
  getContentSettingsSafe,
  updateOrderStatus,
  deleteOrder,
} from "@/lib/api";
import {
  ShoppingCart,
  Check,
  X,
  Trash2,
  Smile,
  RefreshCw,
  Plus,
  Search,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");

  // Manual Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsSafe(),
    retry: false,
  });

  const { data: settings } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettingsSafe(),
    retry: false,
  });

  const storeWhatsapp = settings?.contactWhatsapp || "918217456264";

  const statusMutation = useMutation({
    mutationFn: (data: { id: string; status: "pending" | "completed" | "cancelled" }) =>
      updateOrderStatus({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrder({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Enquiry deleted successfully");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to delete enquiry");
    },
  });

  const addOrderMutation = useMutation({
    mutationFn: (data: {
      customerName: string;
      customerPhone?: string;
      productId: string;
      productName: string;
    }) => addOrder({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Manual WhatsApp enquiry added");
      closeAddModal();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to add enquiry");
    },
  });

  const handleStatusChange = (id: string, status: "pending" | "completed" | "cancelled") => {
    statusMutation.mutate({ id, status });
  };

  const handleDeleteOrder = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete enquiry for "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setCustomerName("");
    setCustomerPhone("");
    setProductName("");
    setSelectedProductId("");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !productName) {
      toast.error("Please fill in customer name and requested piece");
      return;
    }

    addOrderMutation.mutate({
      customerName,
      customerPhone: customerPhone || undefined,
      productId: selectedProductId || "manual_" + Date.now(),
      productName,
    });
  };

  // Calculations
  const pendingOrders = orders.filter((o: any) => o.status === "pending");
  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const cancelledOrders = orders.filter((o: any) => o.status === "cancelled");

  // Filtered orders list
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-wide">
            WhatsApp Enquiries & Orders
          </h1>
          <p className="text-muted-foreground text-sm">
            Track customer enquiries initiated by clicking the "Enquire on WhatsApp" buttons.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold hover:opacity-95 shadow-lg shadow-gold/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Manual Order</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121215] border border-gold/5 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Enquiries
            </div>
            <div className="text-2xl font-bold font-display text-cream">{orders.length}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-gold/5 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Pending Action
            </div>
            <div className="text-2xl font-bold font-display text-cream">{pendingOrders.length}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-gold/5 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
            <Smile className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Success Rate
            </div>
            <div className="text-2xl font-bold font-display text-cream">
              {orders.length > 0
                ? `${Math.round((completedOrders.length / (orders.length - cancelledOrders.length || 1)) * 100)}%`
                : "0%"}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121215] border border-gold/10 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              statusFilter === "all"
                ? "bg-gold text-primary-foreground shadow-md"
                : "bg-ink/50 text-muted-foreground hover:text-cream border border-white/5"
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              statusFilter === "pending"
                ? "bg-gold text-primary-foreground shadow-md"
                : "bg-ink/50 text-muted-foreground hover:text-cream border border-white/5"
            }`}
          >
            Pending ({pendingOrders.length})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              statusFilter === "completed"
                ? "bg-gold text-primary-foreground shadow-md"
                : "bg-ink/50 text-muted-foreground hover:text-cream border border-white/5"
            }`}
          >
            Completed ({completedOrders.length})
          </button>
          <button
            onClick={() => setStatusFilter("cancelled")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              statusFilter === "cancelled"
                ? "bg-gold text-primary-foreground shadow-md"
                : "bg-ink/50 text-muted-foreground hover:text-cream border border-white/5"
            }`}
          >
            Cancelled ({cancelledOrders.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customer, phone, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-xs outline-none transition"
          />
        </div>
      </div>

      {/* Enquiries List */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading enquiries...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground border border-gold/10 rounded-2xl bg-[#121215] flex flex-col items-center justify-center gap-3">
          <ShoppingCart className="h-10 w-10 text-gold/20" />
          <span>No enquiries match your filter.</span>
          <p className="text-xs text-muted-foreground max-w-sm">
            When users click the WhatsApp buttons on your store, their requests will automatically register here.
          </p>
        </div>
      ) : (
        <div className="bg-[#121215] border border-gold/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold/10 text-xs uppercase tracking-wider text-muted-foreground bg-[#17171c]/50">
                  <th className="p-4 font-semibold">Enquiry ID</th>
                  <th className="p-4 font-semibold">Customer Details</th>
                  <th className="p-4 font-semibold">Requested Piece</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date Logged</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5 text-sm">
                {filteredOrders.map((order: any) => {
                  const rawPhone = (order.customerPhone || storeWhatsapp).replace(/[^0-9]/g, "");
                  const whatsappChatUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                    `Hi ${order.customerName}! Thank you for your enquiry regarding "${order.productName}" at Elira Luxe.`
                  )}`;

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition">
                      <td className="p-4 font-mono text-xs text-gold">
                        #{order.id.split("_")[1] || order.id}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-cream">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.customerPhone || `+${storeWhatsapp}`}
                        </div>
                      </td>
                      <td className="p-4 text-cream font-medium">{order.productName}</td>

                      <td className="p-4">
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
                      <td className="p-4 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <a
                          href={whatsappChatUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center p-1.5 rounded-lg border border-gold/20 text-gold hover:bg-gold/10 transition"
                          title="Chat with Customer on WhatsApp"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </a>

                        {order.status !== "completed" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "completed")}
                            className="p-1.5 rounded-lg border border-green-500/10 text-green-400 hover:bg-green-500/10 transition cursor-pointer"
                            title="Mark Completed"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {order.status !== "cancelled" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "cancelled")}
                            className="p-1.5 rounded-lg border border-purple-500/10 text-purple-400 hover:bg-purple-500/10 transition cursor-pointer"
                            title="Mark Cancelled"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {order.status !== "pending" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "pending")}
                            className="p-1.5 rounded-lg border border-amber-500/10 text-amber-400 hover:bg-amber-500/10 transition cursor-pointer"
                            title="Reset to Pending"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.customerName)}
                          className="p-1.5 rounded-lg border border-red-500/10 text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Add Enquiry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#121215] border border-gold/20 rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-in">
            <button
              onClick={closeAddModal}
              className="absolute top-4 right-4 p-2 rounded-lg border border-gold/10 text-gold hover:border-gold transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-display text-2xl font-semibold mb-6 text-gradient-gold">
              Log Manual WhatsApp Order
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Customer Phone / WhatsApp Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Select Product (Optional)
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = products.find((p: any) => p.id === e.target.value);
                    if (prod) setProductName(prod.name);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition cursor-pointer"
                >
                  <option value="">-- Custom / Direct Order --</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Requested Piece / Items Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Golden Aurelia Layered Pendant"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gold/10">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-6 py-2.5 rounded-full border border-gold/25 text-gold hover:bg-gold/5 text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addOrderMutation.isPending}
                  className="px-6 py-2.5 rounded-full bg-gradient-gold hover:opacity-95 text-primary-foreground text-sm font-semibold transition cursor-pointer"
                >
                  {addOrderMutation.isPending ? "Logging..." : "Log Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
