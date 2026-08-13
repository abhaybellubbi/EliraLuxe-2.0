import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { products } from "@/lib/products";
import { Sparkles, Gem, ShieldCheck } from "lucide-react";

const DURATION = 3000;

const LOADING_STEPS = [
  "Initializing Hydro-Shield 316L Steel...",
  "Loading Signature Innovations...",
  "Fetching @eliraluxe Live Stories...",
  "Illuminate Your Elegance ✨",
];

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;

    // Preload product images in background
    products.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, DURATION / 50);

    // Step text cycler
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, DURATION / 4);

    const fadeTimer = setTimeout(() => setFading(true), DURATION - 400);
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, DURATION);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-500 overflow-hidden select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Background Ambient Glow & Mesh */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-950 to-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Unique Logo Loader Assembly */}
      <div className="relative flex flex-col items-center gap-8 animate-fade-up z-10">
        
        {/* Dual Rotating Halo Rings & Logo Center */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          
          {/* Outer Gold Orbit Ring */}
          <div
            className="absolute inset-0 rounded-full border border-gold/30 border-t-gold border-r-transparent animate-spin"
            style={{ animationDuration: "6s" }}
          />

          {/* Inner Counter-Rotating Ring */}
          <div
            className="absolute inset-3 rounded-full border border-amber-500/40 border-b-amber-400 border-l-transparent animate-spin"
            style={{ animationDuration: "4s", animationDirection: "reverse" }}
          />

          {/* Pulsing Backlight Halo */}
          <div className="absolute inset-6 rounded-full bg-gradient-gold opacity-30 blur-2xl animate-pulse" />

          {/* Floating Sparkles around Ring */}
          <Sparkles
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 text-gold animate-bounce"
            style={{ animationDuration: "2s" }}
          />
          <Gem
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 text-amber-400 animate-pulse"
          />

          {/* Central Logo Badge */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden bg-ink/90 border-2 border-gold/60 p-3 shadow-2xl flex items-center justify-center backdrop-blur-md">
            <img
              src={logo}
              alt="Elira Luxe Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] animate-pulse"
            />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="text-center space-y-2">
          <div className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Elira</span>
            <span className="font-script shimmer-gold text-5xl md:text-6xl font-normal">Luxe</span>
          </div>
          <div className="text-[11px] tracking-[0.4em] uppercase font-bold text-gold/80 flex items-center justify-center gap-2">
            <span>✦</span>
            <span>Demi-Fine Jewellery</span>
            <span>✦</span>
          </div>
        </div>

        {/* Loading Progress Bar & Status Step */}
        <div className="w-64 space-y-2.5 pt-2">
          <div className="w-full h-1.5 rounded-full bg-zinc-800/80 border border-gold/20 overflow-hidden relative p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-gold transition-all duration-150 shadow-md shadow-gold/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[11px] font-mono text-center text-zinc-400 flex items-center justify-center gap-1.5 min-h-[20px]">
            <ShieldCheck className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="animate-fade-in key={stepIndex}">
              {LOADING_STEPS[stepIndex]}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
