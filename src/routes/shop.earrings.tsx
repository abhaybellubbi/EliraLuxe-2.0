import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/earrings")({
  component: () => (
    <CategoryPage
      category="Earrings"
      eyebrow="Demi-Fine Earrings"
      title="Earrings"
      description="From subtle studs to drop earrings — hypoallergenic, lightweight, and finished to last."
    />
  ),
  head: () => ({
    meta: [
      { title: "Earrings — Elira Luxe" },
      {
        name: "description",
        content:
          "Shop Elira Luxe earrings in premium surgical stainless steel — hypoallergenic and tarnish proof.",
      },
      { property: "og:title", content: "Earrings — Elira Luxe" },
      {
        property: "og:description",
        content:
          "Shop Elira Luxe earrings in premium surgical stainless steel — hypoallergenic and tarnish proof.",
      },
      { name: "twitter:title", content: "Earrings — Elira Luxe" },
      {
        name: "twitter:description",
        content:
          "Shop Elira Luxe earrings in premium surgical stainless steel — hypoallergenic and tarnish proof.",
      },
    ],
  }),
});
