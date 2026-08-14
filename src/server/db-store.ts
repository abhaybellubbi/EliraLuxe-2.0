import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { products as initialRawProducts } from "../lib/products";

import { SUPABASE_URL, SUPABASE_ANON_KEY, supabase } from "../lib/supabase";
export { supabase };

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

export interface Promotion {
  id: string;
  title: string;
  type: "discount" | "banner" | "festival" | "limited_time" | "coupon" | "flash_sale";
  description: string;
  code?: string;
  discountValue?: string;
  active: boolean;
  imageUrl?: string;
  startTime?: string;
  endTime?: string;
}

export interface ContentSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactWhatsappCommunity: string;
  contactInstagramCommunity?: string;
  featuredCollections: string[];
  showUniqueStyles?: boolean;
  showInstagramStatus?: boolean;
  showTrendingLooks?: boolean;
  showAIChatbot?: boolean;
  showPriceTags?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  productId: string;
  productName: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface UniqueStyleItem {
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

export interface StorySlide {
  id: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  caption: string;
  tag: string;
  productName: string;
  whatsappText: string;
}

export interface InstagramStoryItem {
  id: string;
  title: string;
  avatar: string;
  category: string;
  hasUnseen?: boolean;
  slides: StorySlide[];
}

export interface InstagramPostItem {
  id: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  likes?: string;
  comments?: string;
  handle: string;
  caption: string;
  tag: string;
}

export interface DatabaseSchema {
  products: Product[];
  promotions: Promotion[];
  contentSettings: ContentSettings;
  orders: Order[];
  uniqueStyles: UniqueStyleItem[];
  instagramStories: InstagramStoryItem[];
  instagramPosts: InstagramPostItem[];
}

const IS_SERVERLESS = process.env.VERCEL || process.env.NETLIFY || process.env.CLOUDFLARE_WORKERS;
const DB_FILE = IS_SERVERLESS ? "/tmp/db.json" : path.resolve(process.cwd(), "db.json");
const ORIGINAL_DB_FILE = path.resolve(process.cwd(), "db.json");

let cachedDb: DatabaseSchema | null = null;
let writePromise: Promise<void> = Promise.resolve();

export function getInitialData(): DatabaseSchema {
  const products: Product[] = initialRawProducts.map((p) => ({
    ...p,
    stockStatus: p.stockStatus as any,
  }));

  const promotions: Promotion[] = [];

  const contentSettings: ContentSettings = {
    heroTitle: "Illuminate",
    heroSubtitle: "Your Elegance",
    heroTagline:
      "Heirloom-worthy pieces in premium surgical stainless steel — water resistant, tarnish proof, and made for every day.",
    aboutText:
      "Elira Luxe was founded with a single mission: to create demi-fine jewellery that blends everyday durability with timeless luxury. Crafted from 316L surgical stainless steel and finished in 18k PVD vacuum gold plating, our pieces are 100% water resistant, hypoallergenic, and built for modern life.",
    contactEmail: "ayeshachinnur@gmail.com",
    contactPhone: "+91 82174 56264",
    contactWhatsapp: "918217456264",
    contactWhatsappCommunity: "https://chat.whatsapp.com/E7J2Ow2RFVcCbJI5huTemq",
    contactInstagramCommunity: "https://instagram.com/elira.luxe",
    featuredCollections: ["Chain Pendants", "Earrings", "Openable Kada", "Rings"],
    showUniqueStyles: true,
    showInstagramStatus: true,
    showTrendingLooks: true,
    showAIChatbot: true,
    showPriceTags: false,
  };

  const uniqueStyles: UniqueStyleItem[] = [
    {
      id: "us-1",
      title: "Liquid Gold Stacking",
      subtitle: "Modular Layering System",
      tagline: "Designed with proportional link ratios so multiple chains never tangle or bunch up.",
      badge: "INNOVATION #01",
      image: "/src/assets/lookbook-1.jpg",
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
      id: "us-2",
      title: "Waterproof Everyday Luxe",
      subtitle: "316L Surgical Steel Grade",
      tagline: "Wear in the shower, pool, gym, or ocean without taking off a single piece.",
      badge: "INNOVATION #02",
      image: "/src/assets/marketing-hero-3d.png",
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
      id: "us-3",
      title: "Ear Architecture Huggies",
      subtitle: "Asymmetric Geometric Stacks",
      tagline: "Sculptural drops and clip-on ear cuffs engineered for maximum sparkle with zero weight.",
      badge: "INNOVATION #03",
      image: "/src/assets/lookbook-3.jpg",
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
      id: "us-4",
      title: "Modern Royal Mangalsutra",
      subtitle: "Everyday Heritage Fusion",
      tagline: "Bridging timeless traditional black beads with sleek, contemporary office-wear silhouettes.",
      badge: "INNOVATION #04",
      image: "/src/assets/lookbook-2.jpg",
      innovations: [
        "Micro-facet black onyx beads",
        "Reinforced steel wire core",
        "Reversible drop solitaire charm",
      ],
      suggestedProducts: [
        { name: "Minimalist Drop Mangalsutra", category: "Mangalsutra" },
        { name: "Floral Motif Mangalsutra", category: "Mangalsutra" },
      ],
    },
    {
      id: "us-5",
      title: "Celestial Dual-Tone Kada",
      subtitle: "Reversible Gold & Steel Finish",
      tagline: "Dual-layer PVD plating allowing you to switch between 18k Gold and Platinum Silver in one click.",
      badge: "INNOVATION #05",
      image: "/src/assets/marketing-hero-3d.png",
      innovations: [
        "Reversible 2-in-1 finish",
        "Precision click-open hinge",
        "Scratch-proof ion bonding",
      ],
      suggestedProducts: [
        { name: "Signature Openable Kada", category: "Openable Kada" },
        { name: "Dual-Tone Solitaire Ring", category: "Rings" },
      ],
    },
    {
      id: "us-6",
      title: "Floral Luminary Drops",
      subtitle: "Hand-Polished Zirconia Solitaires",
      tagline: "Prism-cut AAA cubic zirconia stones set in surgical steel for diamond-level brilliance.",
      badge: "INNOVATION #06",
      image: "/src/assets/lookbook-1.jpg",
      innovations: [
        "Prism 57-facet brilliant cut",
        "Micro-prong claw setting",
        "Ultra-sparkle refractive index",
      ],
      suggestedProducts: [
        { name: "Gold Aurelia Layered Pendant", category: "Chain Pendants" },
        { name: "Emerald Cut Dangle Earrings", category: "Earrings" },
      ],
    },
  ];

  const instagramStories: InstagramStoryItem[] = [
    {
      id: "story-1",
      title: "New Drops",
      avatar: "/src/assets/logo.png",
      category: "✨ 2026 Collection",
      hasUnseen: true,
      slides: [
        {
          id: "sl-1",
          mediaType: "image",
          mediaUrl: "/src/assets/lookbook-1.jpg",
          caption: "Elevate your everyday with 18k PVD Gold layered chains ✦ Water & Sweat proof!",
          tag: "🔥 BESTSELLER",
          productName: "Golden Aurelia Layered Pendant",
          whatsappText: "Hi! I saw the New Drops story on Instagram Status. I want to buy the Golden Aurelia Layered Pendant.",
        },
        {
          id: "sl-2",
          mediaType: "image",
          mediaUrl: "/src/assets/lookbook-3.jpg",
          caption: "Emerald Sparkle Ear Architecture. Light on ears, heavy on elegance ✨",
          tag: "👑 ROYAL EDITION",
          productName: "Emerald Cut Dangle Earrings",
          whatsappText: "Hi! I want to order the Emerald Cut Dangle Earrings from Instagram Stories.",
        },
      ],
    },
    {
      id: "story-2",
      title: "Water Test",
      avatar: "/src/assets/logo.png",
      category: "🌊 100% Waterproof",
      hasUnseen: true,
      slides: [
        {
          id: "sl-3",
          mediaType: "image",
          mediaUrl: "/src/assets/marketing-hero-3d.png",
          caption: "No tarnish. No green skin. 316L Surgical Stainless Steel built for daily showers & workouts!",
          tag: "🛡️ GUARANTEED",
          productName: "Waterproof Herringbone Gold Stack",
          whatsappText: "Hi! I am interested in ordering the Waterproof Herringbone Gold Stack featured in your Water Test status.",
        },
      ],
    },
  ];

  const instagramPosts: InstagramPostItem[] = [
    {
      id: "post-1",
      mediaType: "image",
      mediaUrl: "/src/assets/lookbook-1.jpg",
      handle: "elira.luxe",
      caption: "Golden hour glow hits different when your jewellery is 100% water resistant ✨ Tap to shop the look.",
      tag: "Golden Aurelia Stack",
    },
    {
      id: "post-2",
      mediaType: "image",
      mediaUrl: "/src/assets/lookbook-2.jpg",
      handle: "elira.luxe",
      caption: "Clean lines & effortless modern elegance. Designed in Surgical Steel 316L 💼✨",
      tag: "Minimalist Executive Kada",
    },
    {
      id: "post-3",
      mediaType: "image",
      mediaUrl: "/src/assets/lookbook-3.jpg",
      handle: "elira.luxe",
      caption: "Turn heads at every evening gathering with our handcrafted anti-tarnish emerald pieces 💚",
      tag: "Emerald Luxe Statement",
    },
  ];

  return {
    products,
    promotions,
    contentSettings,
    orders: [],
    uniqueStyles,
    instagramStories,
    instagramPosts,
  };
}

export async function readDb(): Promise<DatabaseSchema> {
  if (cachedDb) return cachedDb;

  const initial = getInitialData();

  // 1. Try reading from Supabase cloud database
  try {
    const { data: supaData } = await supabase
      .from("elira_store_state")
      .select("payload")
      .eq("id", 1)
      .maybeSingle();

    if (supaData && supaData.payload) {
      const payload = supaData.payload as Partial<DatabaseSchema>;
      cachedDb = {
        products: Array.isArray(payload.products) && payload.products.length > 0 ? payload.products : initial.products,
        promotions: Array.isArray(payload.promotions) ? payload.promotions : [],
        contentSettings: payload.contentSettings || initial.contentSettings,
        orders: Array.isArray(payload.orders) ? payload.orders : [],
        uniqueStyles: Array.isArray(payload.uniqueStyles) && payload.uniqueStyles.length > 0 ? payload.uniqueStyles : initial.uniqueStyles,
        instagramStories: Array.isArray(payload.instagramStories) && payload.instagramStories.length > 0 ? payload.instagramStories : initial.instagramStories,
        instagramPosts: Array.isArray(payload.instagramPosts) && payload.instagramPosts.length > 0 ? payload.instagramPosts : initial.instagramPosts,
      };
      return cachedDb;
    }
  } catch (supaErr) {
    console.log("Supabase cloud sync notice (falling back to disk):", supaErr);
  }

  // 2. Fallback to Disk JSON Storage
  try {
    if (IS_SERVERLESS) {
      try {
        await fs.access(DB_FILE);
      } catch {
        const originalData = await fs.readFile(ORIGINAL_DB_FILE, "utf-8");
        await fs.writeFile(DB_FILE, originalData, "utf-8");
      }
    }

    const data = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(data) as Partial<DatabaseSchema>;

    cachedDb = {
      products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : initial.products,
      promotions: Array.isArray(parsed.promotions) ? parsed.promotions : [],
      contentSettings: parsed.contentSettings || initial.contentSettings,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      uniqueStyles: Array.isArray(parsed.uniqueStyles) && parsed.uniqueStyles.length > 0 ? parsed.uniqueStyles : initial.uniqueStyles,
      instagramStories: Array.isArray(parsed.instagramStories) && parsed.instagramStories.length > 0 ? parsed.instagramStories : initial.instagramStories,
      instagramPosts: Array.isArray(parsed.instagramPosts) && parsed.instagramPosts.length > 0 ? parsed.instagramPosts : initial.instagramPosts,
    };

    return cachedDb;
  } catch (error) {
    console.error("Failed to read database file, initializing:", error);
    cachedDb = initial;
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    } catch (writeErr) {
      console.error("Failed to initialize database file on disk:", writeErr);
    }
    return cachedDb;
  }
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  cachedDb = data;

  // 1. Sync to Supabase cloud database
  try {
    await supabase.from("elira_store_state").upsert({
      id: 1,
      payload: data,
      updated_at: new Date().toISOString(),
    });
  } catch (supaErr) {
    console.log("Supabase write notice:", supaErr);
  }

  // 2. Write to local file on disk
  writePromise = writePromise.then(async () => {
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write database file:", err);
      throw err;
    }
  });

  await writePromise;
}
