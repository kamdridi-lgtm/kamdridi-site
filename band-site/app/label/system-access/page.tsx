"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function SystemAccessPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/label/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials or unauthorized terminal.");
      }

      router.push("/label/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050403] px-5 py-20 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,198,106,0.08),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-4 py-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f4c66a]/50 bg-black text-sm font-black text-[#f4c66a] shadow-[0_0_20px_rgba(244,198,106,0.18)]">
              KR
            </span>
            <span className="font-display text-xl uppercase tracking-[0.16em] text-[#f4c66a]">
              KAMDRIDI RECORDS
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-[#f4c66a]" />
            <h1 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
              System Access
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-stone-500">
              Restricted Terminal
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="rounded border border-red-500/50 bg-red-500/10 p-3 text-center text-xs uppercase tracking-widest text-red-500">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-white/10 bg-black/50 p-3 text-sm text-white placeholder-stone-600 focus:border-[#f4c66a] focus:outline-none"
                placeholder="system@kamdridi.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Master Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-white/10 bg-black/50 p-3 text-sm text-white placeholder-stone-600 focus:border-[#f4c66a] focus:outline-none"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-[#f4c66a] p-4 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#ffe09a] disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {loading ? "Authenticating..." : "Establish Connection"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
