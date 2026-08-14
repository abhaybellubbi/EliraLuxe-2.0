import { useState, useRef } from "react";
import { addOrder, getContentSettings } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ShoppingBag,
  Sparkles,
  Box,
  RotateCw,
  X,
  ShieldCheck,
  Zap,
  Eye,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category:
    | "Chain Pendants"
    | "Earrings"
    | "Chain Bracelets"
    | "Openable Kada"
    | "Rings"
    | "Mangalsutra"
    | "Bangles"
    | "Anklets";
  image: string;
  tagline: string;
  description?: string;
  stockStatus: "in_stock" | "out_of_stock" | "limited_stock";
  stockQuantity: number;
  sizes?: string[];
}

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stockStatus === "out_of_stock";
  const isLimitedStock = product.stockStatus === "limited_stock";

  // 3D Card tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);

  // Smooth 360 degree continuous auto-orbit animation loop
  useEffect(() => {
    let animFrameId: number;
    if (is3DModalOpen && autoRotate) {
      const loop = () => {
        setOrbitAngle((prev) => (prev + 1) % 360);
        animFrameId = requestAnimationFrame(loop);
      };
      animFrameId = requestAnimationFrame(loop);
    }
    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [is3DModalOpen, autoRotate]);

  const { data: settings } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettings(),
  });

  const storeWhatsapp = (settings?.contactWhatsapp || "918217456264").replace(/[^0-9]/g, "");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isOutOfStock) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // tilt up/down
    const rY = ((x - centerX) / centerX) * 12; // tilt left/right

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    if (!isOutOfStock) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleEnquiry = async () => {
    if (isOutOfStock) return;

    try {
      const randomNames = [
        "Aarav Sharma",
        "Priya Patel",
        "Rohan Gupta",
        "Ananya Iyer",
        "Vikram Singh",
        "Sneha Rao",
        "Aditya Joshi",
        "Diya Malhotra",
        "Karan Mehta",
        "Meera Sen",
      ];
      const randomName =
        randomNames[Math.floor(Math.random() * randomNames.length)] + " (WhatsApp)";
      const randomPhone = "+91 98" + Math.floor(10000000 + Math.random() * 90000000);

      await addOrder({
        data: {
          customerName: randomName,
          customerPhone: randomPhone,
          productId: product.id,
          productName: product.name,
        },
      });
      toast.success(`Enquiry logged for "${product.name}"! Opening WhatsApp...`);
    } catch (error) {
      console.error("Failed to log enquiry:", error);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Elira Luxe! ✨ I would like to enquire about "${product.name}" (${product.category}). Tagline: "${product.tagline}". Please share pricing & 3D preview details.`
  );
  const whatsappUrl = `https://wa.me/${storeWhatsapp}?text=${whatsappMessage}`;

  return (
    <>
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
        className={`group relative bg-card rounded-2xl overflow-hidden border border-border transition-all duration-500 hover:border-gold hover:shadow-2xl hover:shadow-gold/20 flex flex-col justify-between ${
          isOutOfStock ? "opacity-75 select-none" : ""
        }`}
      >
        {/* Image Container with 3D Light Sweep Sheen */}
        <div className="aspect-square overflow-hidden bg-cream relative cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isOutOfStock ? "filter grayscale contrast-75" : "group-hover:scale-110"
            }`}
          />

          {/* Golden Sheen Sweep Effect on Hover */}
          {!isOutOfStock && isHovered && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-amber-300/30 to-transparent transform -skew-x-25 animate-light-sweep" />
            </div>
          )}

          {/* Interactive 3D Orbit Badge */}
          {!isOutOfStock && (
            <button
              type="button"
              onClick={() => setIs3DModalOpen(true)}
              className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-full bg-ink/80 backdrop-blur-md border border-gold/40 text-gold text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-lg hover:bg-gradient-gold hover:text-black transition duration-300 group/btn"
              title="Click to view 3D Interactive Hologram"
            >
              <Box className="w-3.5 h-3.5 text-gold group-hover/btn:text-black animate-spin" style={{ animationDuration: "10s" }} />
              <span>3D Orbit View</span>
            </button>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="font-display text-2xl text-cream tracking-widest px-4 py-2 border border-cream/30 bg-ink/80 rounded-md">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Limited Stock Tag */}
          {isLimitedStock && !isOutOfStock && (
            <div className="absolute top-3 right-3 z-20 bg-amber-500/90 text-primary-foreground text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
              Only {product.stockQuantity} Left
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 text-center flex flex-col items-center justify-between flex-1 space-y-3">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold-deep mb-1 flex items-center justify-center gap-1">
              <span>{product.category}</span>
              <span className="text-gold">✦</span>
              <span className="text-[9px] text-muted-foreground font-mono">3D Tech</span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-1 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2 min-h-[32px]">
              {product.tagline}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] uppercase tracking-wider font-bold text-gold-deep">
              <ShieldCheck className="w-3 h-3 text-gold-deep" />
              <span>18K PVD Gold · 316L Surgical Steel</span>
            </div>
          </div>

          <div className="w-full pt-1 flex gap-2">
            {!isOutOfStock && (
              <button
                type="button"
                onClick={() => setIs3DModalOpen(true)}
                className="p-2.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition"
                title="Open 3D Holographic Stage"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            {isOutOfStock ? (
              <span className="inline-block w-full py-2.5 rounded-full bg-secondary text-muted-foreground text-xs uppercase tracking-widest font-bold cursor-not-allowed border border-border">
                Out of Stock
              </span>
            ) : (
              <a
                href={whatsappUrl}
                onClick={handleEnquiry}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Enquire on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </article>

      {/* Interactive 3D Holographic Orbit Stage Modal */}
      {is3DModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0f0f12] border border-gold/40 rounded-3xl p-6 shadow-2xl space-y-6 text-cream overflow-hidden">
            {/* Hologram Stage Glow Background */}
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold/20 pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gold/10 border border-gold/30">
                  <Box className="w-5 h-5 text-gold animate-spin" style={{ animationDuration: "12s" }} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold" />
                    Interactive 3D Hologram Stage
                  </div>
                  <h3 className="font-display text-xl font-bold text-cream">
                    {product.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIs3DModalOpen(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-cream hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3D Holographic Orbit Display Area */}
            <div className="relative aspect-square w-full rounded-2xl bg-ink border border-gold/20 overflow-hidden flex items-center justify-center group/stage">
              {/* Floating Hologram Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

              {/* 3D Orbiting Ring */}
              <div className="absolute w-72 h-72 rounded-full border border-gold/30 animate-spin pointer-events-none opacity-40" style={{ animationDuration: "25s" }} />
              <div className="absolute w-80 h-80 rounded-full border border-dashed border-amber-400/20 animate-spin pointer-events-none opacity-30" style={{ animationDuration: "40s", animationDirection: "reverse" }} />

              {/* 3D Product Image Card */}
              <div
                style={{
                  transform: `perspective(1000px) rotateY(${orbitAngle}deg) rotateX(${
                    Math.sin((orbitAngle * Math.PI) / 180) * 10
                  }deg)`,
                  transition: autoRotate ? "none" : "transform 0.2s ease-out",
                  transformStyle: "preserve-3d",
                }}
                className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/40 bg-cream"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-amber-300/30 pointer-events-none" />
              </div>

              {/* Holographic Light Beam Sweep */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-gold/15 to-transparent transform -skew-x-25 animate-light-sweep" />
              </div>

              {/* Interactive Rotation Control Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-gold/30 text-xs">
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] px-3 py-1 rounded-full transition ${
                    autoRotate
                      ? "bg-gold text-black shadow-md"
                      : "bg-white/10 text-muted-foreground hover:text-cream"
                  }`}
                >
                  <RotateCw className="w-3 h-3" />
                  <span>360° Auto Orbit</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground uppercase">Angle:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={orbitAngle}
                    onChange={(e) => {
                      setAutoRotate(false);
                      setOrbitAngle(parseInt(e.target.value));
                    }}
                    className="w-24 accent-gold cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Material Engineering Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-ink/70 border border-gold/15 space-y-1">
                <div className="font-semibold text-gold flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  <span>316L Surgical Steel</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Hypoallergenic medical grade core. 100% rust, sweat, & green skin proof.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-ink/70 border border-gold/15 space-y-1">
                <div className="font-semibold text-gold flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>18k PVD Vacuum Gold</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  10x thicker real gold ion plating. Zero tarnish, high lustre daily wear.
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex gap-3 pt-2 border-t border-gold/10">
              <button
                type="button"
                onClick={() => setIs3DModalOpen(false)}
                className="flex-1 py-3 rounded-full border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/10 transition"
              >
                Close 3D View
              </button>
              <a
                href={whatsappUrl}
                onClick={handleEnquiry}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-full bg-gradient-gold text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-gold/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
