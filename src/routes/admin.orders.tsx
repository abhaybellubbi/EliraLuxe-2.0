import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrderStatus } from "@/lib/api";
import { ShoppingCart, Check, X, TrendingUp, Trash2, Smile, Frown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

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

  const handleStatusChange = (id: string, status: "pending" | "completed" | "cancelled") => {
    statusMutation.mutate({ id, status });
  };

  // Calculations
  const pendingOrders = orders.filter((o: any) => o.status === "pending");
  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const cancelledOrders = orders.filter((o: any) => o.status === "cancelled");

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
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Enquiries List */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading enquiries...</div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground border border-gold/10 rounded-2xl bg-[#121215] flex flex-col items-center justify-center gap-3">
          <ShoppingCart className="h-10 w-10 text-gold/20" />
          <span>No customer enquiries logged yet.</span>
          <p className="text-xs text-muted-foreground max-w-sm">
            When users browse your collection and click the WhatsApp buttons, their requests will
            register here automatically.
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
                  <th className="p-4 font-semibold text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5 text-sm">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition">
                    <td className="p-4 font-mono text-xs text-gold">
                      #{order.id.split("_")[1] || order.id}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-cream">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.customerPhone || "+91 82174 56264"}
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
                          className="p-1.5 rounded-lg border border-red-500/10 text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                          title="Mark Cancelled"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      {order.status !== "pending" && (
                        <button
                          onClick={() => handleStatusChange(order.id, "pending")}
                          className="p-1.5 rounded-lg border border-purple-500/10 text-purple-400 hover:bg-purple-500/10 transition cursor-pointer"
                          title="Reset to Pending"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
