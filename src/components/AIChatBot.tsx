import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, RefreshCw, ShoppingBag, CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  recommendations?: {
    id: string;
    name: string;
    category: string;
    image: string;
    tagline: string;
  }[];
  options?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "✨ Hello! I am your **Elira AI Jewellery Stylist**. I can help you select the perfect piece or stack for any outfit, occasion, or gift!",
    options: ["👗 Match my Outfit / Occasion", "🎁 Gift Recommendation", "🌊 Waterproof & Daily Wear Guide", "✨ Build a Jewellery Stack"],
  },
];

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: dbProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleOptionClick = (optionText: string) => {
    handleSendMessage(optionText);
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

    // Simulate AI thinking & processing response
    setTimeout(() => {
      let botResponseText = "";
      let recs: Message["recommendations"] = [];
      let options: string[] = [];

      const qLower = query.toLowerCase();

      if (qLower.includes("outfit") || qLower.includes("match") || qLower.includes("occasion") || qLower.includes("dress") || qLower.includes("sari") || qLower.includes("office") || qLower.includes("party")) {
        botResponseText = "For occasions and outfits, we recommend pairing our high-lustre 18k PVD gold plated surgical steel with clean geometric lines. Here are curated pieces matched for your look:";
        
        recs = dbProducts.slice(0, 3).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          tagline: p.tagline,
        }));

        options = ["✨ Show Earrings", "💍 Show Rings & Kadas", "💬 Chat with Human Stylist"];
      } else if (qLower.includes("gift") || qLower.includes("birthday") || qLower.includes("anniversary")) {
        botResponseText = "Gifting Elira Luxe means gifting zero-tarnish, hypoallergenic luxury that lasts a lifetime! Here are our top gift-ready choices:";
        recs = dbProducts.filter((p: any) => p.category === "Openable Kada" || p.category === "Chain Pendants").slice(0, 3).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          tagline: p.tagline,
        }));
        options = ["🎁 Custom Gift Packing Enquiry", "✨ View All Collections"];
      } else if (qLower.includes("waterproof") || qLower.includes("tarnish") || qLower.includes("skin") || qLower.includes("shower") || qLower.includes("steel")) {
        botResponseText = "All Elira Luxe pieces are forged in **316L Surgical Grade Stainless Steel** with 18k PVD vacuum gold coating. They are 100% shower-safe, sweatproof, perfume-safe, and nickel-free (hypoallergenic)!";
        options = ["🌊 Show Daily Wear Stacks", "✨ How to Care for Steel"];
      } else if (qLower.includes("earring") || qLower.includes("ear")) {
        botResponseText = "Our earrings feature lightweight hollowcore architecture and click-lock closures for all-day comfort without earlobe fatigue.";
        recs = dbProducts.filter((p: any) => p.category === "Earrings").slice(0, 3).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          tagline: p.tagline,
        }));
        options = ["💍 Show Finger Rings", "✨ Show Mangalsutras"];
      } else if (qLower.includes("ring") || qLower.includes("kada") || qLower.includes("bangle")) {
        botResponseText = "Here are our bestselling Openable Kadas & Finger Rings. Designed with comfort-fit curves and anti-tarnish coating.";
        recs = dbProducts.filter((p: any) => p.category === "Openable Kada" || p.category === "Rings").slice(0, 3).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          tagline: p.tagline,
        }));
        options = ["✨ Show Chain Pendants", "👗 Match my Outfit / Occasion"];
      } else {
        botResponseText = `Thank you for asking! Elira Luxe specializes in anti-tarnish, 100% waterproof surgical steel jewellery. Here are top recommendations based on your enquiry:`;
        recs = dbProducts.slice(0, 2).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          tagline: p.tagline,
        }));
        options = ["👗 Match my Outfit / Occasion", "✨ Build a Jewellery Stack", "💬 Chat on WhatsApp"];
      }

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: botResponseText,
        recommendations: recs,
        options,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
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
        <div className="fixed bottom-24 right-4 md:right-8 z-50 w-[92vw] sm:w-[420px] max-h-[640px] h-[80vh] bg-card border border-gold/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
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
                  Personal Selection & Style Assistant
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-cream/70 hover:text-cream hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
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
                  className={`max-w-[85%] p-3.5 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-gradient-gold text-primary-foreground rounded-br-none shadow-md font-medium"
                      : "bg-card border border-border text-foreground rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Recommendations Cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-[10px] font-bold text-gold-deep uppercase tracking-wider">
                        Recommended Selection:
                      </div>
                      <div className="grid gap-2">
                        {msg.recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex items-center gap-3 p-2 bg-background border border-border rounded-xl"
                          >
                            <img
                              src={rec.image}
                              alt={rec.name}
                              className="w-12 h-12 rounded-lg object-cover bg-ink flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground truncate">{rec.name}</div>
                              <div className="text-[10px] text-muted-foreground truncate">{rec.category}</div>
                            </div>
                            <a
                              href={`https://wa.me/918217456264?text=${encodeURIComponent(
                                `Hi Elira Luxe! AI Stylist suggested "${rec.name}" for me. Please share details.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-full bg-gold/20 text-gold-deep hover:bg-gold hover:text-black transition"
                              title="Enquire on WhatsApp"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </a>
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
              <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                <Bot className="w-4 h-4 text-gold animate-bounce" />
                <span>AI Stylist is picking recommendations...</span>
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
              placeholder="Ask AI Stylist (e.g. 'Match earrings for blue dress')..."
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
    </>
  );
}
