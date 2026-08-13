import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/bracelets")({
  component: () => (
    <CategoryPage
      category="Chain Bracelets"
      eyebrow="Demi-Fine Bracelets"
      title="Bracelets & Bangles"
      description="Sculpted cuffs, pavé bangles, and everyday chains — engineered for round-the-clock wear."
    />
  ),
  head: () => ({
    meta: [
      { title: "Bracelets — Elira Luxe" },
      {
        name: "description",
        content: "Discover Elira Luxe bracelets and bangles in premium surgical stainless steel.",
      },
      { property: "og:title", content: "Bracelets — Elira Luxe" },
      {
        property: "og:description",
        content: "Discover Elira Luxe bracelets and bangles in premium surgical stainless steel.",
      },
      { name: "twitter:title", content: "Bracelets — Elira Luxe" },
      {
        name: "twitter:description",
        content: "Discover Elira Luxe bracelets and bangles in premium surgical stainless steel.",
      },
    ],
  }),
});
