import { QueryClient } from "@tanstack/react-query";
import { Link, createRouter, useRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("DefaultErrorComponent caught:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-deep">Elira Luxe</p>
        <h1 className="font-display text-4xl text-foreground md:text-5xl">
          This page didn't load
        </h1>
        <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground">
          {error?.message || "Please try again, or return home to keep browsing the collection."}
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-3 text-xs font-bold text-primary-foreground uppercase tracking-wider shadow-lg shadow-gold/20 transition hover:opacity-90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-xs font-bold text-foreground uppercase tracking-wider transition hover:border-gold hover:text-gold-deep"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
    notFoundMode: "root",
  });

  return router;
};
