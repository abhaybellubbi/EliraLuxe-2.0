import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/rings")({
  component: () => (
    <CategoryPage
      category="Rings"
      eyebrow="Demi-Fine Rings"
      title="Finger Rings"
      description="Statement crystals, stackable bands, and delicate adjustables — crafted in premium surgical steel."
    />
  ),
  head: () => ({
    meta: [
      { title: "Finger Rings — Elira Luxe" },
      {
        name: "description",
        content:
          "Discover Elira Luxe premium surgical steel finger rings — water-resistant, tarnish-proof, and designed to shine.",
      },
      { property: "og:title", content: "Finger Rings — Elira Luxe" },
      {
        property: "og:description",
        content:
          "Discover Elira Luxe premium surgical steel finger rings — water-resistant, tarnish-proof, and designed to shine.",
      },
      { name: "twitter:title", content: "Finger Rings — Elira Luxe" },
      {
        name: "twitter:description",
        content:
          "Discover Elira Luxe premium surgical steel finger rings — water-resistant, tarnish-proof, and designed to shine.",
      },
    ],
  }),
});
