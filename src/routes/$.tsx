import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Elira Luxe — Page moved" },
      {
        name: "description",
        content: "Continue browsing Elira Luxe demi-fine jewellery if a page has moved.",
      },
    ],
  }),
  component: CatchAllPage,
});

function CatchAllPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-deep">Elira Luxe</p>
        <h1 className="mt-4 font-display text-5xl text-foreground md:text-6xl">
          This page has moved
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          Continue exploring our demi-fine jewellery collection, or return home to find your next
          everyday glow.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-gold/20 transition hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-gold hover:text-gold-deep"
          >
            View collection
          </Link>
        </div>
      </div>
    </div>
  );
}
