import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/shop/bangles")({
  component: () => (
    <CategoryPage
      category="Bangles"
      eyebrow="Indian Traditional Bangles"
      title="Traditional Bangles"
      description="Gold-plated checkerboard kadas, intricate filigree, and royal enamel bangles — built for special occasions."
    />
  ),
  head: () => ({
    meta: [
      { title: "Indian Traditional Bangles — Elira Luxe" },
      {
        name: "description",
        content:
          "Explore Elira Luxe traditional Indian gold kadas and bangles — intricate filigree, ruby accents, and royal designs.",
      },
      { property: "og:title", content: "Indian Traditional Bangles — Elira Luxe" },
      {
        property: "og:description",
        content:
          "Explore Elira Luxe traditional Indian gold kadas and bangles — intricate filigree, ruby accents, and royal designs.",
      },
      { name: "twitter:title", content: "Indian Traditional Bangles — Elira Luxe" },
      {
        name: "twitter:description",
        content:
          "Explore Elira Luxe traditional Indian gold kadas and bangles — intricate filigree, ruby accents, and royal designs.",
      },
    ],
  }),
});
