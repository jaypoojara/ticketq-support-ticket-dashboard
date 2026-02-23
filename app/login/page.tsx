"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMemberstack } from "@memberstack/react";
import Link from "next/link";

export default function LoginPage() {
  const memberstack = useMemberstack();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await memberstack.loginMemberEmailPassword({ email, password });
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#1e1b4b" }}
    >
      {/* Background texture dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Login card */}
      <div
        className="relative w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg mb-3"
            style={{ background: "var(--accent)", fontFamily: "var(--font-outfit)" }}
          >
            TQ
          </div>
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-outfit)", color: "var(--fg)" }}
          >
            TicketQ
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
            Sign in to your support dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "var(--fg)" }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--fg)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "var(--fg)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg px-3.5 py-2.5 pr-10 text-sm outline-none transition-all"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--fg)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "var(--fg-muted)" }}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-xs"
              style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: loading ? "var(--accent)" : "var(--accent)" }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--accent-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ width: 15, height: 15 }}
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: "var(--fg-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
