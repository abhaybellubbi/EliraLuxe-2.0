import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authenticateAdmin } from "@/lib/api";
import logo from "@/assets/logo.png";
import { Lock, User, AlertCircle, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const search: any = useSearch({ from: "/admin/login" });
  const redirectPath = search.redirect || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authenticateAdmin({ data: { username, password } });
      if (res.success && res.token) {
        // Set cookie for 7 days
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        document.cookie = `elira_admin_token=${res.token}; path=/; expires=${expires.toUTCString()};`;

        navigate({ to: redirectPath });
      } else {
        setError(res.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0f] relative px-4 overflow-hidden">
      {/* Visual background decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold-deep/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />

      {/* Glassmorphic card container */}
      <div className="relative w-full max-w-md bg-[#121215]/80 backdrop-blur-xl rounded-2xl border border-gold/20 shadow-2xl p-8 md:p-10 animate-fade-up">
        {/* Branding */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Elira Luxe"
            className="h-20 w-20 mx-auto object-contain mb-4 animate-float"
          />
          <h1 className="font-display text-4xl text-gradient-gold font-semibold tracking-wide">
            Elira Luxe
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">
            Admin Login
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
              htmlFor="username"
            >
              Admin Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                <User className="h-4 w-4" />
              </span>
              <input
                id="username"
                type="text"
                required
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-ink/50 border border-gold/15 focus:border-gold text-cream text-sm placeholder-muted-foreground outline-none transition duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
              htmlFor="password"
            >
              Security Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-ink/50 border border-gold/15 focus:border-gold text-cream text-sm placeholder-muted-foreground outline-none transition duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-gold hover:opacity-95 text-primary-foreground font-medium transition duration-300 shadow-xl shadow-gold/15 hover:shadow-gold/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-center text-sm uppercase tracking-widest"
          >
            {loading ? "Authenticating..." : "Enter Admin Dashboard"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-gold/70 hover:text-gold transition duration-300"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Website</span>
          </Link>
        </div>

        <div className="mt-6 text-center text-[10px] text-muted-foreground border-t border-gold/10 pt-4">
          Authorized personnel only. Sessions are monitored.
        </div>
      </div>
    </div>
  );
}
