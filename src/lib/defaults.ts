import { products as rawProducts } from "./products";

export const initialProducts = rawProducts;

export const initialContentSettings = {
  heroTitle: "Illuminate",
  heroSubtitle: "Your Elegance",
  heroTagline:
    "Heirloom-worthy pieces in premium surgical stainless steel — water resistant, tarnish proof, and made for every day.",
  aboutText: "",
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
};

export const initialUniqueStyles = [
  {
    id: "liquid-gold-stacking",
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
    id: "waterproof-daily-luxe",
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
    id: "ear-architecture",
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
];

export const initialInstagramStories = [
  {
    id: "story-waterproof-test",
    title: "Waterproof Test",
    avatar: "/src/assets/lookbook-1.jpg",
    category: "LIVE DEMO",
    hasUnseen: true,
    slides: [
      {
        id: "slide-1",
        mediaType: "image" as const,
        mediaUrl: "/src/assets/lookbook-1.jpg",
        caption: "🌊 24 Hours Sea Water & Perfume Test - Zero Tarnish Guarantee!",
        tag: "18k Gold PVD",
        productName: "Signature Openable Kada",
        whatsappText: "Hi Elira Luxe! Saw your Waterproof Test story. Please share Openable Kada details!",
      },
    ],
  },
];

export const initialInstagramPosts = [
  {
    id: "post-1",
    mediaType: "image" as const,
    mediaUrl: "/src/assets/lookbook-1.jpg",
    likes: "2,480",
    comments: "142",
    handle: "@eliraluxe",
    caption: "✨ Heirloom craftsmanship in 316L Surgical Steel & 18k PVD Vacuum Gold.",
    tag: "Demi-Fine Jewellery",
  },
];
