import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/chain-bracelets")({
  component: () => (
    <CategoryPage
      category="Chain Bracelets"
      eyebrow="Demi-Fine Chain Bracelets"
      title="Chain Bracelets"
      description="Everyday chains and delicate sliders — engineered for round-the-clock wear."
    />
  ),
  head: () => ({
    meta: [
      { title: "Chain Bracelets — Elira Luxe" },
      {
        name: "description",
        content: "Discover Elira Luxe chain bracelets in premium surgical stainless steel.",
      },
      { property: "og:title", content: "Chain Bracelets — Elira Luxe" },
      {
        property: "og:description",
        content: "Discover Elira Luxe chain bracelets in premium surgical stainless steel.",
      },
      { name: "twitter:title", content: "Chain Bracelets — Elira Luxe" },
      {
        name: "twitter:description",
        content: "Discover Elira Luxe chain bracelets in premium surgical stainless steel.",
      },
    ],
  }),
});
