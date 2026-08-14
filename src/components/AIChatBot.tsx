import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  Volume2,
  VolumeX,
  Ruler,
  Eye,
  Gift,
  Shirt,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Info,
} from "lucide-react";
import { getProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface RecommendationItem {
  id: string;
  name: string;
  category: string;
  image: string;
  tagline: string;
  sizes?: string[];
  stockStatus?: string;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  recommendations?: RecommendationItem[];
  options?: string[];
  isSizeCalculator?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "✨ Welcome to **Elira Luxe AI Stylist**!\nI can help you build custom stacks, match jewellery to your outfit, find your perfect Kada or Ring size, or pick non-tarnish gifts.",
    options: [
      "👗 Match My Outfit / Vibe",
      "📏 Find My Ring & Kada Size",
      "✨ Build a 3-Piece Stack",
      "🎁 Pick a Luxury Gift",
      "🌊 Waterproof & Care Guide",
    ],
  },
];

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<RecommendationItem | null>(null);

  // Size calculator state inside chat
  const [measureType, setMeasureType] = useState<"kada" | "ring">("kada");
  const [measureValue, setMeasureValue] = useState("");
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: dbProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const productsList = Array.isArray(dbProducts) ? dbProducts : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Voice speech synthesis read-aloud
  const speakText = (text: string) => {
    if (!isSpeechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_✨✦👑💼🌊🎁]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleOptionClick = (optionText: string) => {
    handleSendMessage(optionText);
  };

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(measureValue);
    if (isNaN(num) || num <= 0) {
      setCalcResult("Please enter a valid measurement number.");
      return;
    }

    if (measureType === "kada") {
      // Wrist circumference or diameter calculation
      if (num < 2.3 || (num > 50 && num < 56)) {
        setCalcResult("Recommended Kada Size: 2.4 (Small/Medium wrist - 54mm inner diameter)");
      } else if (num >= 2.3 && num <= 2.6 || (num >= 56 && num <= 61)) {
        setCalcResult("Recommended Kada Size: 2.6 (Standard/Medium-Large wrist - 58mm inner diameter)");
      } else {
        setCalcResult("Recommended Kada Size: 2.8 (Large wrist - 62mm inner diameter)");
      }
    } else {
      // Ring circumference in mm
      if (num < 50) {
        setCalcResult("Recommended Ring Size: US 5 (Inner diameter ~15.7mm)");
      } else if (num >= 50 && num < 54) {
        setCalcResult("Recommended Ring Size: US 6 (Inner diameter ~16.5mm)");
      } else if (num >= 54 && num < 58) {
        setCalcResult("Recommended Ring Size: US 7 (Inner diameter ~17.3mm)");
      } else if (num >= 58 && num < 62) {
        setCalcResult("Recommended Ring Size: US 8 (Inner diameter ~18.2mm)");
      } else {
        setCalcResult("Recommended Ring Size: US 9+ (Inner diameter ~19.0mm+)");
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query) return;

    const userMsg: Message = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponseText = "";
      let recs: RecommendationItem[] = [];
      let options: string[] = [];
      let showSizeCalc = false;

      const qLower = query.toLowerCase();

      if (qLower.includes("size") || qLower.includes("ring size") || qLower.includes("kada size") || qLower.includes("measure")) {
        botResponseText = "📏 **Interactive Size Assistant**\nUse our built-in size calculator below to find your exact Openable Kada or Finger Ring measurement:";
        showSizeCalc = true;
        options = ["✨ Show Openable Kadas", "💍 Show Finger Rings", "👗 Match My Outfit / Vibe"];
      } else if (qLower.includes("stack") || qLower.includes("3-piece") || qLower.includes("build")) {
        botResponseText = "✨ **Curated 3-Piece Jewellery Stack**\nHere is a complete heirloom-worthy stack featuring a Chain Pendant, Earrings, and an Openable Kada in 18k PVD Gold:";
        
        const pendant = productsList.find((p: any) => p.category === "Chain Pendants");
        const earring = productsList.find((p: any) => p.category === "Earrings");
        const kada = productsList.find((p: any) => p.category === "Openable Kada");

        recs = [pendant, earring, kada].filter(Boolean).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          tagline: p.tagline,
          sizes: p.sizes,
          stockStatus: p.stockStatus,
        }));

        options = ["👑 Royal Festive Stack", "💼 Office Minimalist Stack", "🎁 Enquire Entire Stack on WhatsApp"];
      } else if (qLower.includes("outfit") || qLower.includes("match") || qLower.includes("dress") || qLower.includes("festive") || qLower.includes("vibe") || qLower.includes("party")) {
        botResponseText = "👗 **Stylist Match for Outfits & Occasions**\nFor sarees, evening gowns, or chic casuals, we recommend pairing our high-lustre 18k PVD gold plated surgical steel with clean pavé accents:";
        
        recs = productsList.slice(0, 3).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          tagline: p.tagline,
          sizes: p.sizes,
          stockStatus: p.stockStatus,
        }));

        options = ["✨ Build a 3-Piece Stack", "📏 Find My Ring & Kada Size", "💬 Direct WhatsApp Stylist"];
      } else if (qLower.includes("gift") || qLower.includes("birthday") || qLower.includes("anniversary")) {
        botResponseText = "🎁 **Luxury Gift Selection**\nGifting Elira Luxe means gifting 100% water-resistant, tarnish-proof, hypoallergenic luxury. Here are top gift choices:";
        
        recs = productsList
          .filter((p: any) => p.category === "Openable Kada" || p.category === "Chain Pendants")
          .slice(0, 3)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            image: p.image,
            tagline: p.tagline,
            sizes: p.sizes,
            stockStatus: p.stockStatus,
          }));

        options = ["🎁 Custom Gift Enquiry", "📏 Size Guide", "✨ View Full Collection"];
      } else if (qLower.includes("waterproof") || qLower.includes("care") || qLower.includes("tarnish") || qLower.includes("steel") || qLower.includes("shower")) {
        botResponseText = "🌊 **100% Waterproof & Care Guaranteed**\n• **Core Material:** 316L Surgical Stainless Steel\n• **Finish:** 18k PVD Vacuum Gold Plating\n• **Durability:** 100% safe in daily showers, sea water, workouts & perfume. Zero rust, zero green skin, zero tarnish.";
        
        recs = productsList.slice(0, 2).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          tagline: p.tagline,
          sizes: p.sizes,
          stockStatus: p.stockStatus,
        }));

        options = ["✨ Build a 3-Piece Stack", "👗 Match My Outfit / Vibe"];
      } else if (qLower.includes("earring")) {
        botResponseText = "✨ **Earring Selection**\nHandcrafted with lightweight hollowcore architecture for all-day comfort without earlobe drag:";
        recs = productsList
          .filter((p: any) => p.category === "Earrings")
          .slice(0, 3)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            image: p.image,
            tagline: p.tagline,
            sizes: p.sizes,
            stockStatus: p.stockStatus,
          }));
        options = ["💍 Show Finger Rings", "✨ Show Openable Kadas"];
      } else if (qLower.includes("ring") || qLower.includes("kada") || qLower.includes("bangle")) {
        botResponseText = "💍 **Openable Kadas & Finger Rings**\nCrafted with comfort-fit rounded edges and pavé crystal detail:";
        recs = productsList
          .filter((p: any) => p.category === "Openable Kada" || p.category === "Rings")
          .slice(0, 3)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            image: p.image,
            tagline: p.tagline,
            sizes: p.sizes,
            stockStatus: p.stockStatus,
          }));
        options = ["📏 Find My Ring & Kada Size", "✨ Build a 3-Piece Stack"];
      } else {
        botResponseText = `✨ Thank you for reaching out! Elira Luxe specializes in anti-tarnish 316L surgical steel & 18k PVD gold demi-fine jewellery.\nHere are recommended pieces for you:`;
        recs = productsList.slice(0, 3).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          tagline: p.tagline,
          sizes: p.sizes,
          stockStatus: p.stockStatus,
        }));
        options = ["👗 Match My Outfit / Vibe", "📏 Find My Ring & Kada Size", "✨ Build a 3-Piece Stack"];
      }

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: botResponseText,
        recommendations: recs,
        options,
        isSizeCalculator: showSizeCalc,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      speakText(botResponseText);
    }, 600);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setCalcResult(null);
  };

  return (
    <>
      {/* Floating Widget Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Jewellery Stylist"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-gold text-primary-foreground shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center gap-2 border border-gold/40 animate-float"
      >
        <div className="relative">
          <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </div>
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider pr-1">
          AI Stylist
        </span>
      </button>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-8 z-50 w-[92vw] sm:w-[430px] max-h-[660px] h-[82vh] bg-card border border-gold/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Chat Header */}
          <div className="p-4 bg-ink text-cream border-b border-gold/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-gold p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-ink rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gold" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-display text-base font-semibold text-gradient-gold">
                  <span>Elira AI Stylist</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                </div>
                <div className="text-[10px] text-cream/70 tracking-wider">
                  Personal Selection & Size Assistant
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Read Aloud Toggle */}
              <button
                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                className={`p-1.5 rounded-full transition ${
                  isSpeechEnabled ? "text-gold bg-gold/10" : "text-cream/60 hover:text-cream"
                }`}
                title={isSpeechEnabled ? "Voice Output ON" : "Voice Output OFF"}
              >
                {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reset Chat */}
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-full text-cream/60 hover:text-cream hover:bg-white/10 transition"
                title="Reset Conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Close Window */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-cream/60 hover:text-cream hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Category Chips */}
          <div className="px-3 py-2 bg-ink/90 border-b border-gold/10 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none text-[10px]">
            <button
              onClick={() => handleOptionClick("👗 Match My Outfit / Vibe")}
              className="px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-black transition flex items-center gap-1"
            >
              <Shirt className="w-3 h-3" />
              <span>Outfit Match</span>
            </button>
            <button
              onClick={() => handleOptionClick("📏 Find My Ring & Kada Size")}
              className="px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-black transition flex items-center gap-1"
            >
              <Ruler className="w-3 h-3" />
              <span>Size Calculator</span>
            </button>
            <button
              onClick={() => handleOptionClick("✨ Build a 3-Piece Stack")}
              className="px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-black transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>3-Piece Stack</span>
            </button>
            <button
              onClick={() => handleOptionClick("🎁 Pick a Luxury Gift")}
              className="px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-black transition flex items-center gap-1"
            >
              <Gift className="w-3 h-3" />
              <span>Luxury Gift</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-background via-cream/20 to-background dark:via-secondary/10 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-gradient-gold text-primary-foreground rounded-br-none shadow-md font-medium"
                      : "bg-card border border-border text-foreground rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Built-in Interactive Size Calculator Widget */}
                  {msg.isSizeCalculator && (
                    <div className="mt-3 p-3 rounded-xl bg-ink/80 border border-gold/20 text-cream space-y-3">
                      <div className="flex items-center gap-2 border-b border-gold/10 pb-2">
                        <Ruler className="w-4 h-4 text-gold" />
                        <span className="font-display font-semibold text-gold text-xs">
                          Ring & Kada Size Calculator
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setMeasureType("kada");
                            setCalcResult(null);
                          }}
                          className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition ${
                            measureType === "kada"
                              ? "bg-gold text-black"
                              : "bg-white/5 text-muted-foreground hover:text-cream"
                          }`}
                        >
                          Openable Kada
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMeasureType("ring");
                            setCalcResult(null);
                          }}
                          className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition ${
                            measureType === "ring"
                              ? "bg-gold text-black"
                              : "bg-white/5 text-muted-foreground hover:text-cream"
                          }`}
                        >
                          Finger Ring
                        </button>
                      </div>

                      <form onSubmit={handleCalculateSize} className="flex gap-2 items-center">
                        <input
                          type="number"
                          step="0.1"
                          placeholder={
                            measureType === "kada"
                              ? "Wrist size in inches (e.g. 2.4)"
                              : "Finger circumference (mm)"
                          }
                          value={measureValue}
                          onChange={(e) => setMeasureValue(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-black/50 border border-gold/20 text-xs text-cream outline-none focus:border-gold"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-gradient-gold text-black font-bold text-xs hover:opacity-90 transition"
                        >
                          Calc
                        </button>
                      </form>

                      {calcResult && (
                        <div className="p-2 rounded bg-gold/10 border border-gold/30 text-gold text-[11px] font-medium animate-fade-in">
                          {calcResult}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommendations Cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-[10px] font-bold text-gold-deep uppercase tracking-wider flex items-center justify-between">
                        <span>Recommended Selection:</span>
                        <span className="text-[9px] text-muted-foreground font-normal">Click for preview</span>
                      </div>
                      <div className="grid gap-2">
                        {msg.recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex items-center gap-3 p-2 bg-background border border-border rounded-xl hover:border-gold/50 transition cursor-pointer group"
                            onClick={() => setPreviewProduct(rec)}
                          >
                            <img
                              src={rec.image}
                              alt={rec.name}
                              className="w-12 h-12 rounded-lg object-cover bg-ink flex-shrink-0 border border-border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground truncate group-hover:text-gold-deep transition">
                                {rec.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground truncate">{rec.category}</div>
                              {rec.sizes && rec.sizes.length > 0 && (
                                <div className="text-[9px] text-gold/80 font-mono">
                                  Sizes: {rec.sizes.join(", ")}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="p-1.5 rounded-full bg-secondary hover:bg-gold/20 text-foreground transition"
                                title="Quick View"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`https://wa.me/918217456264?text=${encodeURIComponent(
                                  `Hi Elira Luxe! AI Stylist suggested "${rec.name}" for me. Please share availability & details.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-full bg-gold/20 text-gold-deep hover:bg-gold hover:text-black transition"
                                title="Enquire on WhatsApp"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Option Pills */}
                {msg.options && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        className="px-3 py-1.5 rounded-full border border-gold/40 bg-card text-[11px] text-foreground font-medium hover:bg-gradient-gold hover:text-primary-foreground transition shadow-sm"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] animate-pulse">
                <Bot className="w-4 h-4 text-gold animate-bounce" />
                <span>AI Stylist is customizing recommendations...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-card border-t border-border flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI Stylist (e.g. 'Match ring size 7' or 'Stack for saree')..."
              className="flex-1 px-4 py-2.5 rounded-full bg-secondary/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-full bg-gradient-gold text-primary-foreground disabled:opacity-40 transition shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Product Quick View Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#121215] border border-gold/30 rounded-3xl p-6 shadow-2xl space-y-4 text-cream">
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:text-cream hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewProduct.image}
              alt={previewProduct.name}
              className="w-full h-56 rounded-2xl object-cover bg-ink border border-gold/10"
            />

            <div>
              <span className="text-[9px] uppercase tracking-widest text-gold font-semibold">
                {previewProduct.category}
              </span>
              <h3 className="font-display text-xl font-bold text-cream mt-0.5">
                {previewProduct.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {previewProduct.tagline}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-ink/60 border border-gold/10 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>316L Surgical Stainless Steel · 18k PVD Gold</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                100% Water Resistant · Anti-Tarnish · Hypoallergenic
              </p>
              {previewProduct.sizes && previewProduct.sizes.length > 0 && (
                <div className="text-[10px] text-gold font-mono pt-1">
                  Available Sizes: {previewProduct.sizes.join(", ")}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="flex-1 py-2.5 rounded-full border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/10 transition"
              >
                Close Preview
              </button>
              <a
                href={`https://wa.me/918217456264?text=${encodeURIComponent(
                  `Hi Elira Luxe! I loved "${previewProduct.name}" suggested by your AI Stylist. Please assist with ordering!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-full bg-gradient-gold text-black text-xs font-bold text-center flex items-center justify-center gap-1.5 hover:opacity-90 transition shadow-lg shadow-gold/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Enquire Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
