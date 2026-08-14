import {
  createFileRoute,
  Outlet,
  Link,
  redirect,
  useRouter,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  FileText,
  CheckSquare,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { checkAdminAuth } from "@/lib/api";

const ADMIN_TOKEN = "elira-luxe-admin-session-token-2026";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") {
      return;
    }

    let isAuthenticated = false;
    if (typeof document !== "undefined") {
      // Client side
      const match = document.cookie.match(/elira_admin_token=([^;]+)/);
      const token = match ? match[1] : "";
      isAuthenticated = token === ADMIN_TOKEN;
    } else {
      // Server side
      try {
        const auth = await checkAdminAuth();
        isAuthenticated = auth.isAuthenticated;
      } catch (err) {
        console.error("Failed to check admin auth on server:", err);
      }
    }

    if (!isAuthenticated) {
      throw redirect({
        to: "/admin/login",
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are on the login page, just render the Outlet without the sidebar
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  const handleLogout = () => {
    document.cookie = "elira_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.invalidate().then(() => {
      window.location.href = "/";
    });
  };

  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products & Stock", icon: ShoppingBag },
    { to: "/admin/content", label: "Content Editor", icon: FileText },
    { to: "/admin/orders", label: "WhatsApp Enquiries", icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen flex bg-[#0d0d0f] text-cream">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#121215] border-r border-gold/10">
        <div className="p-6 border-b border-gold/10 flex items-center gap-3">
          <img src={logo} alt="Elira Luxe Logo" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="font-display text-lg font-semibold text-gradient-gold tracking-wider">
              Elira Luxe
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
              Admin Login
            </p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/admin" }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-cream/70 hover:text-gold hover:bg-gold/5 transition duration-300"
              activeProps={{
                className: "!text-gold-light bg-gold/10 border border-gold/20 shadow-md",
              }}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gold/10 flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gold/70 hover:text-gold hover:bg-gold/5 border border-gold/10 hover:border-gold/30 transition duration-300 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition duration-300 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#121215] border-b border-gold/10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Elira Luxe Logo" className="h-8 w-8 object-contain" />
            <div>
              <h1 className="font-display text-base font-semibold text-gradient-gold tracking-wider">
                Elira Luxe
              </h1>
              <p className="text-[8px] uppercase tracking-widest text-muted-foreground">
                Admin Login
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-gold/20 text-gold"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="lg:hidden absolute top-[65px] left-0 right-0 z-50 bg-[#121215] border-b border-gold/10 p-6 flex flex-col space-y-3 animate-fade-in shadow-2xl">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/admin" }}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-cream/70 hover:text-gold hover:bg-gold/5"
                activeProps={{ className: "!text-gold-light bg-gold/10 border border-gold/20" }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-gold/10 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gold/70 hover:text-gold hover:bg-gold/5 border border-gold/10"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Website</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/5 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        )}

        {/* Dynamic Admin Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
