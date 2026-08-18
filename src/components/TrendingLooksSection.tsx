import { useState } from "react";
import { Flame, Tag, ShoppingBag, ArrowRight, Eye, CheckCircle, Sparkles } from "lucide-react";
import { addOrderSafe } from "@/lib/api";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";
import heroImg from "@/assets/marketing-hero-3d.png";

interface TaggedItem {
  id: string;
  name: string;
  category: string;
  price: string;
  origPrice?: string;
  pinTop: string; // percentage string e.g. "35%"
  pinLeft: string; // percentage string e.g. "50%"
}

interface TrendingLook {
  id: string;
  title: string;
  tagline: string;
  category: string;
  occasion: string;
  image: string;
  stylingNotes: string;
  taggedItems: TaggedItem[];
}

const TRENDING_LOOKS: TrendingLook[] = [
  {
    id: "golden-hour-glam",
    title: "Golden Hour Sunset Glam",
    tagline: "Warm 18k PVD gold tones matched with shimmering emerald drops.",
    category: "Golden Hour",
    occasion: "Date Night & Celebrations",
    image: lookbook1,
    stylingNotes: "Layer two thin gold chains with an open collar silk shirt or off-shoulder dress for maximum warm light reflection.",
    taggedItems: [
      {
        id: "t-1",
        name: "Golden Aurelia Layered Pendant",
        category: "Chain Pendants",
        price: "₹999",
        origPrice: "₹1,499",
        pinTop: "42%",
        pinLeft: "48%",
      },
      {
        id: "t-2",
        name: "Signature Openable Kada",
        category: "Openable Kada",
        price: "₹1,199",
        origPrice: "₹1,799",
        pinTop: "72%",
        pinLeft: "32%",
      },
    ],
  },
  {
    id: "office-minimalist-luxe",
    title: "The Executive Power Stack",
    tagline: "Subtle, structural surgical steel jewelry engineered for corporate confidence.",
    category: "Workwear",
    occasion: "Office & Client Meetings",
    image: lookbook2,
    stylingNotes: "Pair structured blazers with sleek Kada bracelets and a single geometric ring stack. Modern, quiet luxury.",
    taggedItems: [
      {
        id: "t-3",
        name: "Executive Steel & Gold Kada",
        category: "Openable Kada",
        price: "₹1,299",
        origPrice: "₹1,899",
        pinTop: "68%",
        pinLeft: "42%",
      },
      {
        id: "t-4",
        name: "Chevron Lattice Gold Ring",
        category: "Rings",
        price: "₹699",
        origPrice: "₹999",
        pinTop: "75%",
        pinLeft: "60%",
      },
    ],
  },
  {
    id: "evening-emerald-royalty",
    title: "Monsoon & Evening Royalty",
    tagline: "High-contrast emerald stones set in tarnish-proof gold architecture.",
    category: "Evening Party",
    occasion: "Weddings & Gala Dinners",
    image: lookbook3,
    stylingNotes: "Let statement emerald dangles frame your face. Keep hair swept back for maximum light catch.",
    taggedItems: [
      {
        id: "t-5",
        name: "Emerald Cut Dangle Earrings",
        category: "Earrings",
        price: "₹1,299",
        origPrice: "₹1,999",
        pinTop: "32%",
        pinLeft: "40%",
      },
      {
        id: "t-6",
        name: "Teardrop Emerald Kada",
        category: "Openable Kada",
        price: "₹1,499",
        origPrice: "₹2,199",
        pinTop: "62%",
        pinLeft: "55%",
      },
    ],
  },
  {
    id: "poolside-waterproof-stack",
    title: "Ocean & Poolside Daily Stack",
    tagline: "Zero-tarnish guaranteed surgical steel built for 24/7 active lifestyles.",
    category: "Minimalist",
    occasion: "Vacations & Beach Wear",
    image: heroImg,
    stylingNotes: "Never remove your jewelry at the beach or pool. Grade 316L steel remains lustrous through saltwater and sun.",
    taggedItems: [
      {
        id: "t-7",
        name: "Herringbone Solitaire Necklace",
        category: "Chain Pendants",
        price: "₹1,099",
        origPrice: "₹1,599",
        pinTop: "45%",
        pinLeft: "50%",
      },
    ],
  },
];

export function TrendingLooksSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All Looks");
  const [activePinItem, setActivePinItem] = useState<TaggedItem | null>(null);

  const categories = ["All Looks", "Golden Hour", "Workwear", "Evening Party", "Minimalist"];

  const filteredLooks = activeCategory === "All Looks"
    ? TRENDING_LOOKS
    : TRENDING_LOOKS.filter((l) => l.category === activeCategory);

  return (
    <section className="py-20 bg-cream/30 dark:bg-secondary/10 relative overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-3 font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              Curated Style Inspo
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-semibold">
              Trending <span className="font-script shimmer-gold text-5xl md:text-7xl">Looks</span>
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-gradient-gold text-primary-foreground shadow-md shadow-gold/20 scale-105"
                    : "bg-card border border-border text-foreground/80 hover:border-gold/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lookbook Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-10">
          {filteredLooks.map((look) => (
            <div
              key={look.id}
              className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 grid md:grid-cols-12 group"
            >
              {/* Image side with hotspots */}
              <div className="md:col-span-7 relative aspect-[4/5] bg-ink overflow-hidden">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-gold text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {look.occasion}
                  </span>
                </div>

                {/* Hotspot Pins */}
                {look.taggedItems.map((item) => {
                  const isActive = activePinItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{ top: item.pinTop, left: item.pinLeft }}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                    >
                      <button
                        onClick={() => setActivePinItem(isActive ? null : item)}
                        className={`relative p-2 rounded-full transition-transform duration-300 hover:scale-125 focus:outline-none ${
                          isActive ? "bg-rose-500 text-white scale-125" : "bg-gold text-primary-foreground animate-bounce"
                        }`}
                        title={item.name}
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span className="absolute -inset-1 rounded-full bg-gold/40 animate-ping -z-10" />
                      </button>

                      {/* Hotspot Popover Tooltip */}
                      {isActive && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-card/95 backdrop-blur-md border border-gold/40 rounded-2xl p-3 shadow-2xl z-30 animate-fade-in text-left">
                          <div className="text-[10px] font-bold text-gold-deep uppercase tracking-widest mb-1">
                            {item.category}
                          </div>
                          <div className="text-xs font-semibold text-foreground mb-1 line-clamp-1">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs mb-3">
                            <span className="text-[10px] uppercase font-semibold text-gold-deep tracking-wider">Price on Request</span>
                          </div>
                          <a
                            href={`https://wa.me/918217456264?text=${encodeURIComponent(
                              `Hi Elira Luxe! I want to enquire about "${item.name}" from your Trending Looks feature.`
                            )}`}
                            onClick={() =>
                              addOrderSafe({
                                customerName: "Trending Looks Lead (WhatsApp)",
                                customerPhone: "Not Provided (WhatsApp Lead)",
                                productId: item.id,
                                productName: item.name,
                              })
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-1.5 rounded-full bg-gradient-gold text-primary-foreground text-[11px] font-bold flex items-center justify-center gap-1 shadow"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            Enquire Piece
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="absolute bottom-4 left-4 right-4 text-cream flex items-center justify-between text-xs">
                  <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-cream/90 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-gold" />
                    Tap pins to shop items
                  </span>
                </div>
              </div>

              {/* Text side */}
              <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs font-semibold text-gold-deep uppercase tracking-widest mb-2">
                    {look.category} Collection
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-3">{look.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {look.tagline}
                  </p>

                  <div className="bg-secondary/40 rounded-2xl p-4 border border-border mb-6">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-gold-deep mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Styling Note
                    </div>
                    <p className="text-xs text-foreground/80 italic leading-relaxed">
                      "{look.stylingNotes}"
                    </p>
                  </div>

                  {/* Tagged Items List */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Featured Pieces in Look:
                    </h4>
                    <div className="space-y-2">
                      {look.taggedItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-background/60 text-xs"
                        >
                          <div>
                            <span className="font-semibold block">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground">{item.category}</span>
                          </div>
                          <span className="text-[10px] uppercase font-semibold text-gold-deep tracking-wider">Enquire Quote</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/918217456264?text=${encodeURIComponent(
                    `Hi! I would like to order the complete look "${look.title}" from Trending Looks.`
                  )}`}
                  onClick={() =>
                    addOrderSafe({
                      customerName: "Trending Looks Lead (WhatsApp)",
                      customerPhone: "Not Provided (WhatsApp Lead)",
                      productId: look.id,
                      productName: `Complete Look: ${look.title}`,
                    })
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"
                >
                  <span>Order Complete Look</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
