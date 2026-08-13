import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { useQuery } from "@tanstack/react-query";
import { getContentSettings } from "@/lib/api";
import { SplashScreen } from "./SplashScreen";
import { AIChatBot } from "./AIChatBot";

const CURRENT_YEAR = 2026;

const CATEGORY_MAP: Record<string, { to: string; label: string }> = {
  "Chain Pendants": { to: "/shop/chain-pendants", label: "Chain Pendants" },
  Earrings: { to: "/shop/earrings", label: "Earrings" },
  "Chain Bracelets": { to: "/shop/chain-bracelets", label: "Chain Bracelets" },
  "Openable Kada": { to: "/shop/openable-kada", label: "Openable Kada" },
  Rings: { to: "/shop/rings", label: "Finger Rings" },
  Mangalsutra: { to: "/shop/mangalsutra", label: "Mangalsutra" },
  Bangles: { to: "/shop/bangles", label: "Traditional Bangles" },
  Anklets: { to: "/shop/anklets", label: "Anklets" },
};

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-full border border-border hover:border-gold hover:text-gold-deep transition"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const {
    data: settings = {
      contactEmail: "ayeshachinnur@gmail.com",
      contactPhone: "+91 82174 56264",
      contactWhatsapp: "918217456264",
      contactWhatsappCommunity: "https://chat.whatsapp.com/E7J2Ow2RFVcCbJI5huTemq",
      contactInstagramCommunity: "",
      featuredCollections: ["Chain Pendants", "Earrings", "Openable Kada", "Rings"],
      showAIChatbot: true,
      showUniqueStyles: true,
      showInstagramStatus: true,
      showTrendingLooks: true,
      showPriceTags: false,
    },
  } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettings(),
  });

  const featuredCollections = settings.featuredCollections || [
    "Chain Pendants",
    "Earrings",
    "Openable Kada",
    "Rings",
  ];

  const dynamicNav = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Collection" },
    { to: "/#unique-styles", label: "Unique Styles" },
    ...featuredCollections
      .map((cat) => CATEGORY_MAP[cat])
      .filter((n): n is { to: string; label: string } => !!n),
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SplashScreen />
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Elira Luxe"
              className="h-14 w-14 object-contain transition-transform duration-500 group-hover:rotate-6"
            />
            <div className="leading-tight flex flex-col justify-center">
              <div className="font-display text-3xl md:text-4xl text-gradient-gold font-semibold tracking-tight">
                Elira Luxe
              </div>
              <div className="text-[9px] md:text-[10px] tracking-[0.3em] text-muted-foreground uppercase mt-0.5">
                Illuminate Your Elegance
              </div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {dynamicNav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm tracking-wide text-foreground/80 hover:text-gold-deep transition-colors"
                activeProps={{ className: "text-gold-deep font-medium" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-gradient-gold text-primary-foreground text-sm font-medium hover:opacity-90 hover:scale-105 transition shadow-lg shadow-gold/20"
            >
              Enquire
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-full border border-border"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="lg:hidden border-t border-border bg-background/95 backdrop-blur px-6 py-4 flex flex-col gap-3 animate-fade-in">
            {dynamicNav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm text-foreground/80 hover:text-gold-deep"
                activeProps={{ className: "text-gold-deep font-medium" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>
      {settings.showAIChatbot !== false && <AIChatBot />}

      <footer className="border-t border-border bg-ink text-cream mt-20">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Elira Luxe" className="h-14 w-14 object-contain" />
              <span className="font-display text-3xl text-gradient-gold font-semibold tracking-tight">
                Elira Luxe
              </span>
            </div>
            <p className="text-xs tracking-[0.3em] uppercase text-cream/60 mb-2">
              Illuminate Your Elegance
            </p>
            <p className="text-xs text-cream/50">Crafted in India · Est. 2025</p>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>
                <Link to="/shop" className="hover:text-gold transition">
                  All Jewellery
                </Link>
              </li>
              {featuredCollections
                .map((cat) => CATEGORY_MAP[cat])
                .filter((n): n is { to: string; label: string } => !!n)
                .map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="hover:text-gold transition">
                      {n.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  to="/admin"
                  className="hover:text-gold transition text-cream/45 text-xs mt-3 inline-block border border-gold/20 hover:border-gold/50 px-3 py-1 rounded-full"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-gold transition">
                  {settings.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                  className="hover:text-gold"
                >
                  {settings.contactPhone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.contactWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold"
                >
                  WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={settings.contactWhatsappCommunity}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold"
                >
                  Join WhatsApp Community
                </a>
              </li>
              {settings.contactInstagramCommunity && (
                <li>
                  <a
                    href={settings.contactInstagramCommunity}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold"
                  >
                    Join Instagram Community
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Promise</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>Surgical stainless steel</li>
              <li>Water & tarnish resistant</li>
              <li>Built for everyday wear</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/10 py-6 px-6 flex flex-col items-center justify-center gap-4 text-xs text-cream/50">
          <a
            href="https://saikrishnaenterprises.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 hover:border-gold bg-gradient-to-r from-gold-deep/10 to-gold/10 hover:from-gold-deep/20 hover:to-gold/20 transition-all"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-cream/60 group-hover:text-cream/80">
              Powered by
            </span>
            <span className="font-display text-lg font-semibold text-gradient-gold tracking-wider">
              SKE
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-cream/50">
              Sai Krishna Enterprises
            </span>
          </a>
          <span>© {CURRENT_YEAR} Elira Luxe. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
