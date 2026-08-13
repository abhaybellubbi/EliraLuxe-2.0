import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/anklets")({
  component: () => (
    <CategoryPage
      category="Anklets"
      eyebrow="Sterling Silver Payal"
      title="Premium Anklets"
      description="Traditional payals and contemporary anklets featuring floral ghungroos, multi-stone inlays, and vibrant enamelwork."
    />
  ),
  head: () => ({
    meta: [
      { title: "Premium Anklets & Payal — Elira Luxe" },
      {
        name: "description",
        content:
          "Explore the Elira Luxe Premium Anklets (Payal) collection. Traditional craftsmanship featuring silver plating, floral ghungroos, and colorful enamel.",
      },
      { property: "og:title", content: "Premium Anklets & Payal — Elira Luxe" },
      {
        property: "og:description",
        content:
          "Explore the Elira Luxe Premium Anklets (Payal) collection. Traditional craftsmanship featuring silver plating, floral ghungroos, and colorful enamel.",
      },
      { name: "twitter:title", content: "Premium Anklets & Payal — Elira Luxe" },
      {
        name: "twitter:description",
        content:
          "Explore the Elira Luxe Premium Anklets (Payal) collection. Traditional craftsmanship featuring silver plating, floral ghungroos, and colorful enamel.",
      },
    ],
  }),
});
