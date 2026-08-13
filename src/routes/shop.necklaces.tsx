import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/necklaces")({
  component: () => (
    <CategoryPage
      category="Chain Pendants"
      eyebrow="Demi-Fine Necklaces"
      title="Necklaces & Pendants"
      description="Layer-ready chains and statement pendants in surgical stainless steel — built for everyday glow."
    />
  ),
  head: () => ({
    meta: [
      { title: "Necklaces — Elira Luxe" },
      {
        name: "description",
        content:
          "Browse Elira Luxe necklaces & pendants in premium surgical stainless steel — water & tarnish resistant.",
      },
      { property: "og:title", content: "Necklaces — Elira Luxe" },
      {
        property: "og:description",
        content:
          "Browse Elira Luxe necklaces & pendants in premium surgical stainless steel — water & tarnish resistant.",
      },
      { name: "twitter:title", content: "Necklaces — Elira Luxe" },
      {
        name: "twitter:description",
        content:
          "Browse Elira Luxe necklaces & pendants in premium surgical stainless steel — water & tarnish resistant.",
      },
    ],
  }),
});
