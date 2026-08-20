import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsSafe, updateProductSafe, deleteProductSafe } from "@/lib/api";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Upload,
  Link as LinkIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const CATEGORIES = [
  "Chain Pendants",
  "Earrings",
  "Chain Bracelets",
  "Openable Kada",
  "Rings",
  "Mangalsutra",
  "Bangles",
  "Anklets",
] as const;

function AdminProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Chain Pendants");
  const [image, setImage] = useState("");
  const [stockStatus, setStockStatus] = useState<"in_stock" | "out_of_stock" | "limited_stock">(
    "in_stock",
  );
  const [stockQuantity, setStockQuantity] = useState("10");
  const [sizesInput, setSizesInput] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsSafe(),
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => updateProductSafe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editingProduct ? "Product updated successfully" : "Product added successfully");
      closeModal();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to save product");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProductSafe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to delete product");
    },
  });

  const openModal = (product: any | null = null) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name || "");
      setTagline(product.tagline || "");
      setDescription(product.description || product.tagline || "");
      setCategory(product.category || "Chain Pendants");
      setImage(product.image || "");
      setStockStatus(product.stockStatus || "in_stock");
      setStockQuantity(
        product.stockQuantity !== undefined && product.stockQuantity !== null
          ? String(product.stockQuantity)
          : "10"
      );
      setSizesInput(product.sizes && Array.isArray(product.sizes) ? product.sizes.join(", ") : "");
    } else {
      setEditingProduct(null);
      setName("");
      setTagline("");
      setDescription("");
      setCategory("Chain Pendants");
      setImage("");
      setStockStatus("in_stock");
      setStockQuantity("10");
      setSizesInput("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          const compressed = await compressImage(reader.result);
          setImage(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !tagline || !image) {
      toast.error("Please fill in name, tagline, and image");
      return;
    }

    const sizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const productData = {
      id: editingProduct ? editingProduct.id : "prod_" + Math.random().toString(36).substr(2, 9),
      name,
      tagline,
      description: description || tagline,
      category,
      image,
      stockStatus,
      stockQuantity: stockStatus === "out_of_stock" ? 0 : parseInt(stockQuantity) || 0,
      sizes: sizes.length > 0 ? sizes : undefined,
    };

    saveMutation.mutate(productData);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-wide">Products & Stock</h1>
          <p className="text-muted-foreground text-sm">
            Add, modify, delete, and control stock status of your jewelry catalog.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold hover:opacity-95 shadow-lg shadow-gold/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-[#121215] border border-gold/5 shadow-md">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search products by name or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm placeholder-muted-foreground outline-none transition"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-gold-deep" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading inventory...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground border border-gold/10 rounded-2xl bg-[#121215]">
          No products match your filters. Try adjusting search or category filter.
        </div>
      ) : (
        <div className="bg-[#121215] border border-gold/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold/10 text-xs uppercase tracking-wider text-muted-foreground bg-[#17171c]/50">
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Name & Category</th>
                  <th className="p-4 font-semibold">Stock Status</th>
                  <th className="p-4 font-semibold">Quantity</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5 text-sm">
                {filteredProducts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-white/[0.01] transition">
                    <td className="p-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-12 w-12 rounded object-cover border border-gold/10 bg-cream"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-cream">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.category}</div>
                      {p.sizes && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {p.sizes.map((s: string) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.5 rounded text-[8px] bg-gold/10 text-gold border border-gold/10"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                          p.stockStatus === "in_stock"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : p.stockStatus === "out_of_stock"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {p.stockStatus === "in_stock"
                          ? "In Stock"
                          : p.stockStatus === "out_of_stock"
                            ? "Out of Stock"
                            : "Limited Stock"}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-cream">
                      {p.stockStatus === "out_of_stock" ? "0" : p.stockQuantity}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openModal(p)}
                        className="p-2 rounded-lg border border-gold/10 text-gold hover:border-gold hover:bg-gold/5 transition cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 rounded-lg border border-red-500/10 text-red-400 hover:border-red-500 hover:bg-red-500/5 transition cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#121215] border border-gold/20 rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-lg border border-gold/10 text-gold hover:border-gold transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-display text-2xl font-semibold mb-6 text-gradient-gold">
              {editingProduct ? "Edit Product Details" : "Add New Jewelry Piece"}
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Product Name & Category */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pétale Drop Pendant"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tagline & Description */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Short Tagline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pink crystal florals on a delicate gold chain."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Full Description
                </label>
                <textarea
                  placeholder="Provide detailed material description, size suggestions, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition resize-none"
                />
              </div>

              {/* Stock Status & Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Stock Status
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition cursor-pointer"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="limited_stock">Limited Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    disabled={stockStatus === "out_of_stock"}
                    placeholder="10"
                    value={stockStatus === "out_of_stock" ? "0" : stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition disabled:opacity-50 disabled:pointer-events-none"
                  />
                </div>
              </div>

              {/* Sizes / Variants */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Sizes / Variants (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6, 7, 8 (for Rings) or 2.4, 2.6 (for Bangles)"
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-sm outline-none transition"
                />
              </div>

              {/* Image Input (File / Base64 & URL) */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Product Image
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* File Selector */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gold/20 bg-ink/30 hover:border-gold/40 transition relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-6 w-6 text-gold mb-2" />
                    <span className="text-xs text-cream/70 text-center font-medium">
                      Select Image File
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      PNG, JPG, WEBP up to 5MB
                    </span>
                  </div>

                  {/* URL Paste */}
                  <div className="flex flex-col justify-center space-y-2">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                        <LinkIcon className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="Or paste external image URL..."
                        value={image.startsWith("data:") ? "" : image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ink/50 border border-gold/10 focus:border-gold text-cream text-xs outline-none transition"
                      />
                    </div>
                    {image && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gold/5 border border-gold/10">
                        <Check className="h-4 w-4 text-green-400 shrink-0" />
                        <span className="text-[10px] text-muted-foreground truncate">
                          Image Source Loaded
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Image */}
                {image && (
                  <div className="mt-3 flex items-center gap-4 p-3 rounded-xl border border-gold/10 bg-ink/30">
                    <img
                      src={image}
                      alt="Preview"
                      className="h-16 w-16 rounded object-cover border border-gold/15 bg-cream"
                    />
                    <div>
                      <div className="text-xs text-cream font-medium">Image Preview</div>
                      <div className="text-[9px] text-muted-foreground truncate max-w-[300px]">
                        {image.startsWith("data:") ? "Base64 Encoded Local File" : image}
                      </div>
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="text-[10px] text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider mt-1 block"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
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
                  {saveMutation.isPending ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
