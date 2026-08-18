import { useState } from "react";
import { Sparkles, Layers, ShieldCheck, Plus, Check, ShoppingBag, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUniqueStylesSafe, getContentSettingsSafe, addOrderSafe } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/utils";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";
import heroImg from "@/assets/marketing-hero-3d.png";

export interface UniqueStyle {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  image: string;
  innovations: string[];
  suggestedProducts: {
    name: string;
    category: string;
  }[];
}

const FALLBACK_STYLES: UniqueStyle[] = [
  {
    id: "liquid-gold-stacking",
    title: "Liquid Gold Stacking",
    subtitle: "Modular Layering System",
    tagline: "Designed with proportional link ratios so multiple chains never tangle or bunch up.",
    badge: "INNOVATION #01",
    image: lookbook1,
    innovations: [
      "Anti-tangle chain spacing ratio",
      "18k PVD Vacuum Gold Plating",
      "Lightweight ergonomic clasps",
    ],
    suggestedProducts: [
      { name: "Gold Aurelia Layered Pendant", category: "Chain Pendants" },
      { name: "Herringbone Solitaire Choker", category: "Necklaces" },
    ],
  },
  {
    id: "waterproof-daily-luxe",
    title: "Waterproof Everyday Luxe",
    subtitle: "316L Surgical Steel Grade",
    tagline: "Wear in the shower, pool, gym, or ocean without taking off a single piece.",
    badge: "INNOVATION #02",
    image: heroImg,
    innovations: [
      "100% Sweat, Pool & Perfume Safe",
      "Hypoallergenic zero-nickel steel",
      "Lifetime tarnish resistance",
    ],
    suggestedProducts: [
      { name: "Signature Openable Kada", category: "Openable Kada" },
      { name: "Textured Heart Charm Bracelet", category: "Chain Bracelets" },
    ],
  },
  {
    id: "ear-architecture",
    title: "Ear Architecture Huggies",
    subtitle: "Asymmetric Geometric Stacks",
    tagline: "Sculptural drops and clip-on ear cuffs engineered for maximum sparkle with zero weight.",
    badge: "INNOVATION #03",
    image: lookbook3,
    innovations: [
      "Ultra-featherweight hollowcore design",
      "Click-lock secure huggie closure",
      "Non-piercing ear cuff companion",
    ],
    suggestedProducts: [
      { name: "Emerald Cut Dangle Earrings", category: "Earrings" },
      { name: "Three-Tier Amber Huggies", category: "Earrings" },
    ],
  },
  {
    id: "modern-royal-mangalsutra",
    title: "Modern Royal Mangalsutra",
    subtitle: "Everyday Heritage Fusion",
    tagline: "Ultra-sleek black onyx beads with 18k PVD gold solitaire pendant designed for modern wear.",
    badge: "INNOVATION #04",
    image: lookbook2,
    innovations: [
      "Waterproof black onyx bead wire",
      "18k PVD Gold Solitaire centerpiece",
      "Adjustable 16-20 inch sliding chain",
    ],
    suggestedProducts: [
      { name: "Solitaire Royal Mangalsutra", category: "Mangalsutra" },
      { name: "Minimalist Beaded Choker", category: "Necklaces" },
    ],
  },
];

export function UniqueStylesSection() {
  const [selectedStyle, setSelectedStyle] = useState<UniqueStyle | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const { data: dbStyles = [] } = useQuery({
    queryKey: ["uniqueStyles"],
    queryFn: () => getUniqueStylesSafe(),
    retry: false,
  });

  const { data: settings } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettingsSafe(),
    retry: false,
  });

  const storeWhatsapp = (settings?.contactWhatsapp || "918217456264").replace(/[^0-9]/g, "");

  const styles: UniqueStyle[] = dbStyles.length > 0 ? (dbStyles as any) : FALLBACK_STYLES;

  const toggleItemSelect = (itemName: string) => {
    setSelectedItems((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const selectedList = Object.keys(selectedItems).filter((k) => selectedItems[k]);

  const handleStackEnquiry = () => {
    if (!selectedStyle) return;
    try {
      addOrderSafe({
        customerName: "Custom Stack Builder (WhatsApp)",
        customerPhone: `+${storeWhatsapp}`,
        productId: selectedStyle.id,
        productName: `${selectedStyle.title} Stack (${selectedList.join(", ") || "Full Stack"})`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-3 font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-deep animate-spin" style={{ animationDuration: "10s" }} />
            Signature Innovations & Crafts
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            Unique <span className="font-script shimmer-gold text-5xl md:text-7xl">Styles</span>
          </h2>
          <p className="text-base text-muted-foreground font-medium">
            Explore revolutionary jewelry engineering designed for 24/7 durability, effortless layering, and high-shine aesthetic elegance.
          </p>
        </div>

        {/* Unique Styles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {styles.map((style) => (
            <div
              key={style.id}
              className="group relative bg-card border border-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold/20 hover:border-gold hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <img
                  src={resolveMediaUrl(style.image)}
                  alt={style.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-gold/90 text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                    {style.badge}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                    <Layers className="w-4 h-4 text-amber-300" />
                    <span>{style.subtitle}</span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white drop-shadow-md leading-tight">
                    {style.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-card">
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {style.tagline}
                </p>

                <div className="space-y-2">
                  {style.innovations.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-foreground font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-deep flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedStyle(style);
                    const initialSelect: Record<string, boolean> = {};
                    style.suggestedProducts.forEach((p) => {
                      initialSelect[p.name] = true;
                    });
                    setSelectedItems(initialSelect);
                  }}
                  className="w-full mt-4 py-3 rounded-full border border-gold/40 text-foreground hover:bg-gradient-gold hover:text-primary-foreground hover:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Build This Style Stack</span>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BUILDER MODAL */}
      {selectedStyle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-card border border-gold/50 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8">
            <button
              onClick={() => setSelectedStyle(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-border text-foreground hover:bg-secondary transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-gold-deep uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 text-gold-deep" />
              <span>Interactive Style Stack Builder</span>
            </div>

            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {selectedStyle.title} <span className="font-script shimmer-gold">Stack</span>
            </h3>
            <p className="text-xs text-muted-foreground font-medium mb-6">
              Select or customize your items for the {selectedStyle.subtitle}. Order directly via WhatsApp.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="aspect-video md:aspect-square rounded-2xl overflow-hidden border border-border bg-ink relative">
                <img
                  src={resolveMediaUrl(selectedStyle.image)}
                  alt={selectedStyle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <div className="text-white text-xs">
                    <span className="font-bold text-amber-300">99% Style Compatibility Score</span>
                    <p className="text-cream/90 text-[11px] font-medium">Calculated for 24/7 skin harmony & zero tarnish.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs uppercase font-bold text-foreground tracking-wider mb-3">
                    Include Pieces in Stack:
                  </h4>
                  <div className="space-y-2.5">
                    {selectedStyle.suggestedProducts.map((p) => {
                      const isSelected = selectedItems[p.name];
                      return (
                        <button
                          key={p.name}
                          onClick={() => toggleItemSelect(p.name)}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                            isSelected
                              ? "bg-gold/15 border-gold text-foreground font-bold shadow-sm"
                              : "border-border text-muted-foreground hover:border-gold/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                                isSelected ? "bg-gold border-gold text-black" : "border-border"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-foreground">{p.name}</div>
                              <div className="text-[10px] text-muted-foreground font-medium">{p.category}</div>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-gold-deep tracking-wider">Price on Request</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground font-medium">Selected Stack ({selectedList.length} items):</span>
                    <span className="text-xs uppercase tracking-wider font-bold text-gold-deep">Bespoke Quote</span>
                  </div>

                  <a
                    href={`https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(
                      `Hi Elira Luxe! I built a custom "${selectedStyle.title}" stack on your site:\n- Selected pieces: ${selectedList.join(
                        ", "
                      )}. Please share price & availability.`
                    )}`}
                    onClick={handleStackEnquiry}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-xl ${
                      selectedList.length > 0
                        ? "bg-gradient-gold text-primary-foreground hover:scale-[1.02]"
                        : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Enquire & Order Stack on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
