import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Root ErrorComponent caught:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {error?.message || "Something went wrong on our end. You can try refreshing or head back home."}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-gradient-gold px-5 py-2.5 text-xs font-bold text-primary-foreground uppercase tracking-wider shadow-md hover:opacity-90 transition"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-xs font-bold text-foreground uppercase tracking-wider hover:border-gold hover:text-gold-deep transition"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

import logo from "../assets/logo.png";

const getMediaString = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && typeof val.src === "string") return val.src;
  if (typeof val === "object" && typeof val.default === "string") return val.default;
  return String(val);
};

const logoUrl = getMediaString(logo);

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Elira Luxe — Illuminate Your Elegance" },
      {
        name: "description",
        content:
          "Demi-fine jewellery in surgical stainless steel. Water & tarnish resistant. Affordable luxury for everyday wear.",
      },
      { property: "og:title", content: "Elira Luxe — Illuminate Your Elegance" },
      {
        property: "og:description",
        content:
          "Demi-fine jewellery in surgical stainless steel. Water & tarnish resistant. Affordable luxury for everyday wear.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Elira Luxe — Illuminate Your Elegance" },
      {
        name: "twitter:description",
        content:
          "Demi-fine jewellery in surgical stainless steel. Water & tarnish resistant. Affordable luxury for everyday wear.",
      },
      {
        property: "og:image",
        content: logoUrl,
      },
      {
        name: "twitter:image",
        content: logoUrl,
      },
    ],
    links: [
      { rel: "icon", type: "image/png", href: logoUrl },
      { rel: "shortcut icon", href: logoUrl },
      { rel: "apple-touch-icon", href: logoUrl },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Toaster } from "sonner";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
