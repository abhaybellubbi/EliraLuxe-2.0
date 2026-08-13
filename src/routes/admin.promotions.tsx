import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPromotions, updatePromotion, deletePromotion } from "@/lib/api";
import {
  Plus,
  Tag,
  Edit,
  Trash2,
  X,
  Calendar,
  Percent,
  ToggleLeft,
  ToggleRight,
  Flame,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/promotions")({
  component: AdminPromotions,
});

const PROMO_TYPES = [
  { value: "discount", label: "Flat Discount" },
  { value: "banner", label: "Announcement Banner" },
  { value: "festival", label: "Festival Offer" },
  { value: "limited_time", label: "Limited Time Offer" },
  { value: "coupon", label: "Coupon Code" },
  { value: "flash_sale", label: "Flash Sale" },
] as const;

function AdminPromotions() {
  const queryClient = useQueryClient();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState<(typeof PROMO_TYPES)[number]["value"]>("discount");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [active, setActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [endTime, setEndTime] = useState("");

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => updatePromotion({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success(
        editingPromo ? "Promotion updated successfully" : "Promotion created successfully",
      );
      closeModal();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to save promotion");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePromotion({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promotion deleted successfully");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to delete promotion");
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (promo: any) => updatePromotion({ data: { ...promo, active: !promo.active } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promotion status updated");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to toggle status");
    },
  });

  const openModal = (promo: any | null = null) => {
    if (promo) {
      setEditingPromo(promo);
      setTitle(promo.title);
      setType(promo.type);
      setDescription(promo.description);
      setCode(promo.code || "");
      setDiscountValue(promo.discountValue || "");
      setActive(promo.active);
      setImageUrl(promo.imageUrl || "");

      if (promo.endTime) {
        // Format ISO string to datetime-local input format: YYYY-MM-DDTHH:MM
        const date = new Date(promo.endTime);
        const pad = (num: number) => num.toString().padStart(2, "0");
        const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        setEndTime(formattedDate);
      } else {
        setEndTime("");
      }
    } else {
      setEditingPromo(null);
      setTitle("");
      setType("discount");
      setDescription("");
      setCode("");
      setDiscountValue("");
      setActive(true);
      setImageUrl("");
      setEndTime("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please enter a title and description");
      return;
    }

    const promoData = {
      id: editingPromo ? editingPromo.id : "promo_" + Math.random().toString(36).substr(2, 9),
      title,
      type,
      description,
      code: code || undefined,
      discountValue: discountValue || undefined,
      active,
      imageUrl: imageUrl || undefined,
      endTime: endTime ? new Date(endTime).toISOString() : undefined,
    };

    saveMutation.mutate(promoData);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getPromoIcon = (type: string) => {
    switch (type) {
      case "flash_sale":
        return <Flame className="h-5 w-5 text-red-400" />;
      case "banner":
        return <Volume2 className="h-5 w-5 text-blue-400" />;
      default:
        return <Percent className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-wide">
            Promotions & Marketing
          </h1>
          <p className="text-muted-foreground text-sm">
            Create discount codes, homepage marketing banners, and limited-time flash sales.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold hover:opacity-95 shadow-lg shadow-gold/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Promotion</span>
        </button>
      </div>

      {/* Promotions List */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading active promotions...</div>
      ) : promotions.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground border border-gold/10 rounded-2xl bg-[#121215]">
          No promotions created yet. Click "New Promotion" to launch an offer.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo: any) => (
            <div
              key={promo.id}
              className={`rounded-2xl border bg-[#121215] shadow-lg overflow-hidden flex flex-col justify-between transition duration-300 ${
                promo.active
                  ? "border-gold/20 hover:border-gold/40 shadow-gold/5"
                  : "border-white/5 opacity-60"
              }`}
            >
              {/* Promo Header */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-ink border border-gold/10">
                    {getPromoIcon(promo.type)}
                  </div>

                  {/* Status Toggle */}
                  <button
                    onClick={() => toggleActiveMutation.mutate(promo)}
                    className="text-muted-foreground hover:text-gold transition cursor-pointer"
                    title={promo.active ? "Deactivate Offer" : "Activate Offer"}
                  >
                    {promo.active ? (
                      <ToggleRight className="h-8 w-8 text-gold" />
                    ) : (
                      <ToggleLeft className="h-8 w-8" />
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-gold-deep font-semibold">
                    {PROMO_TYPES.find((t) => t.value === promo.type)?.label || promo.type}
                  </span>
                  <h2 className="font-display text-xl font-bold text-cream leading-tight">
                    {promo.title}
                  </h2>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mt-2">
                    {promo.description}
                  </p>
                </div>

                {/* Promo specs */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {promo.code && (
                    <div className="px-2.5 py-1 rounded bg-gold/10 border border-gold/25 text-xs text-gold font-mono">
                      CODE: {promo.code}
                    </div>
                  )}
                  {promo.discountValue && (
                    <div className="px-2.5 py-1 rounded bg-[#17171c] border border-white/5 text-xs text-cream/80 font-semibold">
                      Value: {promo.discountValue}
                    </div>
                  )}
                  {promo.endTime && (
                    <div className="px-2.5 py-1 rounded bg-red-500/5 border border-red-500/20 text-xs text-red-400 flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>Ends: {new Date(promo.endTime).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Promo Footer actions */}
              <div className="px-6 py-4 bg-[#17171c]/50 border-t border-gold/5 flex justify-end gap-2">
                <button
                  onClick={() => openModal(promo)}
                  className="p-2 rounded-lg border border-gold/10 text-gold hover:bg-gold/5 text-xs font-semibold tracking-wider uppercase transition cursor-pointer flex items-center gap-1"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(promo.id, promo.title)}
                  className="p-2 rounded-lg border border-red-500/10 text-red-400 hover:bg-red-500/5 text-xs font-semibold tracking-wider uppercase transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#121215] border border-gold/20 rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-in">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-lg border border-gold/10 text-gold hover:border-gold transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-display text-2xl font-semibold mb-6 text-gradient-gold">
              {editingPromo ? "Edit Promotion Offer" : "Launch New Promotion"}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Title & Type */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Promotion Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 20% Off Summer Special"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Campaign Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition cursor-pointer"
                >
                  {PROMO_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Campaign Copy / Description
                </label>
                <textarea
                  required
                  placeholder="e.g. Flat 20% off storewide on all chains, anklets and kadas. Code valid till end of July."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition resize-none"
                />
              </div>

              {/* Code & Discount Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Discount Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20% or BOGO"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* Image URL & Expiry (Conditional) */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Banner Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Paste banner graphic URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition"
                />
              </div>

              {type === "flash_sale" && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Countdown End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition"
                  />
                </div>
              )}

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-ink/30 border border-gold/5 mt-2">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-cream font-semibold">
                    Set Active Instantly
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Toggle to launch/pause this promotion on the homepage.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(!active)}
                  className="text-gold cursor-pointer"
                >
                  {active ? (
                    <ToggleRight className="h-9 w-9 text-gold" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gold/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 rounded-full border border-gold/25 text-gold hover:bg-gold/5 text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 rounded-full bg-gradient-gold hover:opacity-95 text-primary-foreground text-sm font-semibold transition cursor-pointer"
                >
                  {saveMutation.isPending ? "Saving..." : "Save Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
