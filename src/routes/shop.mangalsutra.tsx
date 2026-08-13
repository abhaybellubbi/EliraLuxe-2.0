import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/mangalsutra")({
  component: () => (
    <CategoryPage
      category="Mangalsutra"
      eyebrow="Demi-Fine Mangalsutras"
      title="Mangalsutras"
      description="Modern designs with traditional black beads in premium surgical stainless steel — water and tarnish resistant."
    />
  ),
  head: () => ({
    meta: [
      { title: "Mangalsutras — Elira Luxe" },
      {
        name: "description",
        content:
          "Discover Elira Luxe premium surgical steel Mangalsutras — water-resistant, tarnish-proof, and designed for daily wear.",
      },
      { property: "og:title", content: "Mangalsutras — Elira Luxe" },
      {
        property: "og:description",
        content:
          "Discover Elira Luxe premium surgical steel Mangalsutras — water-resistant, tarnish-proof, and designed for daily wear.",
      },
      { name: "twitter:title", content: "Mangalsutras — Elira Luxe" },
      {
        name: "twitter:description",
        content:
          "Discover Elira Luxe premium surgical steel Mangalsutras — water-resistant, tarnish-proof, and designed for daily wear.",
      },
    ],
  }),
});
