import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";
import heroImg from "@/assets/marketing-hero-3d.png";
import logo from "@/assets/logo.png";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveMediaUrl(url: string | undefined): string {
  if (!url) return logo;
  if (url.includes("lookbook-1")) return lookbook1;
  if (url.includes("lookbook-2")) return lookbook2;
  if (url.includes("lookbook-3")) return lookbook3;
  if (url.includes("hero") || url.includes("marketing")) return heroImg;
  if (url.includes("logo")) return logo;
  return url;
}
