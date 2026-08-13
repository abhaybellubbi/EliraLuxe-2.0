import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/openable-kada")({
  component: () => (
    <CategoryPage
      category="Openable Kada"
      eyebrow="Demi-Fine Openable Kada"
      title="Openable Kada"
      description="Sculpted cuffs and pavé openable kada — engineered for round-the-clock wear."
    />
  ),
  head: () => ({
    meta: [
      { title: "Openable Kada — Elira Luxe" },
      {
        name: "description",
        content: "Discover Elira Luxe openable kada in premium surgical stainless steel.",
      },
      { property: "og:title", content: "Openable Kada — Elira Luxe" },
      {
        property: "og:description",
        content: "Discover Elira Luxe openable kada in premium surgical stainless steel.",
      },
      { name: "twitter:title", content: "Openable Kada — Elira Luxe" },
      {
        name: "twitter:description",
        content: "Discover Elira Luxe openable kada in premium surgical stainless steel.",
      },
    ],
  }),
});
