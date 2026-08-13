import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/chain-pendants")({
  component: () => (
    <CategoryPage
      category="Chain Pendants"
      eyebrow="Demi-Fine Chain Pendants"
      title="Chain Pendants"
      description="Classic chains and striking pendants — designed to layer perfectly or stand out solo."
    />
  ),
  head: () => ({
    meta: [
      { title: "Chain Pendants — Elira Luxe" },
      {
        name: "description",
        content:
          "Browse Elira Luxe chain pendants in premium surgical stainless steel — water & tarnish resistant.",
      },
      { property: "og:title", content: "Chain Pendants — Elira Luxe" },
      {
        property: "og:description",
        content:
          "Browse Elira Luxe chain pendants in premium surgical stainless steel — water & tarnish resistant.",
      },
      { name: "twitter:title", content: "Chain Pendants — Elira Luxe" },
      {
        name: "twitter:description",
        content:
          "Browse Elira Luxe chain pendants in premium surgical stainless steel — water & tarnish resistant.",
      },
    ],
  }),
});
