"use client";

import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui";
import { membershipTiers, privateVault } from "@/data/site";
import { useApp } from "@/components/providers";

type VaultResponse = {
  intro: string;
  videos: string[];
  communityTopics: string[];
};

export function FanClubPanel() {
  const { fan, setFan } = useApp();
  const [signup, setSignup] = useState({ name: "", email: "", password: "" });
  const [login, setLogin] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<string | null>(null);
  const [vault, setVault] = useState<VaultResponse | null>(null);
  const handledMembershipState = useRef<string | null>(null);

  useEffect(() => {
    const membershipState = new URLSearchParams(window.location.search).get("membership");
    if (!membershipState || handledMembershipState.current === membershipState) {
      return;
    }

    handledMembershipState.current = membershipState;

    if (membershipState === "success") {
      setStatus("Membership checkout confirmed. Welcome to the fan club.");
    }

    if (membershipState === "cancelled") {
      setStatus("Membership checkout was cancelled. You can join any time.");
    }
  }, []);

  useEffect(() => {
    if (!fan) {
      setVault(null);
      return;
    }

    fetch("/api/fan-club/content")
      .then((response) => response.json())
      .then((payload) => {
        if (!payload.error) {
          setVault(payload);
        }
      });
  }, [fan]);

  async function submit(url: string, body: Record<string, string>) {
    setStatus(null);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json();

    if (!response.ok) {
      setStatus(payload.error ?? "Request failed.");
      return;
    }

    setFan(payload.user);
    setStatus(payload.message ?? "Success.");
  }

  async function logout() {
    await fetch("/api/fan-club/session", {
      method: "DELETE"
    });
    setFan(null);
    setVault(null);
    setStatus("Logged out.");
  }

  return (
    <div className="grid gap-6">
      <div id="membership" className="grid gap-6 md:grid-cols-2">
        {membershipTiers.map((tier) => (
          <GlassCard key={tier.id} className="flex h-full flex-col">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{tier.name}</p>
            <p className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-white">{tier.priceLabel}</p>
            <p className="mt-4 text-sm leading-7 text-stone-400">{tier.description}</p>
            <div className="mt-6 grid gap-2">
              {tier.features.map((feature) => (
                <p key={feature} className="text-sm text-stone-300">
                  {feature}
                </p>
              ))}
            </div>
            <div className="mt-8">
              {tier.checkoutUrl ? (
                <a
                  href={tier.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-[#f4c66a] px-6 py-4 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
                >
                  Join
                </a>
              ) : (
                <span className="inline-flex rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[0.25em] text-stone-500">
                  Add payment link
                </span>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Membership Checkout</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-400">
          Fan-club subscriptions use secure Stripe hosted checkout in a new tab. Set each Stripe
          Payment Link redirect URL to `/fan-club?membership=success` so the confirmation message
          appears automatically after purchase.
        </p>
        {status ? <p className="mt-4 text-sm text-emerald-200">{status}</p> : null}
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-6">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Fan Account</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Login or create an account
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              Account access and paid memberships can work together: use Stripe for hosted billing,
              then create or log into your site account here for the fan vault.
            </p>
            <form
              className="mt-8 grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                void submit("/api/fan-club/signup", signup);
              }}
            >
              <input
                className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
                type="text"
                placeholder="Full name"
                value={signup.name}
                onChange={(event) => setSignup((current) => ({ ...current, name: event.target.value }))}
              />
              <input
                className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
                type="email"
                placeholder="Email"
                value={signup.email}
                onChange={(event) => setSignup((current) => ({ ...current, email: event.target.value }))}
              />
              <input
                className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
                type="password"
                placeholder="Password"
                value={signup.password}
                onChange={(event) => setSignup((current) => ({ ...current, password: event.target.value }))}
              />
              <button
                type="submit"
                className="rounded-full bg-[#f4c66a] px-6 py-4 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
              >
                Sign up
              </button>
            </form>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.45em] text-stone-500">Existing members</p>
            <form
              className="mt-6 grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                void submit("/api/fan-club/login", login);
              }}
            >
              <input
                className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
                type="email"
                placeholder="Email"
                value={login.email}
                onChange={(event) => setLogin((current) => ({ ...current, email: event.target.value }))}
              />
              <input
                className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
                type="password"
                placeholder="Password"
                value={login.password}
                onChange={(event) => setLogin((current) => ({ ...current, password: event.target.value }))}
              />
              <button
                type="submit"
                className="rounded-full border border-white/10 px-6 py-4 text-xs uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"
              >
                Login
              </button>
            </form>
            {fan ? (
              <button
                type="button"
                onClick={() => void logout()}
                className="mt-5 text-sm text-stone-400 transition hover:text-[#f4c66a]"
              >
                Logout {fan.name}
              </button>
            ) : null}
          </GlassCard>
        </div>

        <GlassCard id="vault">
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Exclusive Content</p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
            Private videos, community, and early access
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-400">{privateVault.intro}</p>

          {fan && vault ? (
            <div className="mt-8 grid gap-6">
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100">
                Welcome back, {fan.name}. Your fan club account is active.
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Private videos</p>
                <div className="mt-4 grid gap-3">
                  {vault.videos.map((video) => (
                    <div key={video} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-stone-200">
                      {video}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Fan community</p>
                <div className="mt-4 grid gap-3">
                  {vault.communityTopics.map((topic) => (
                    <div key={topic} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-stone-200">
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-black/20 p-8 text-sm leading-7 text-stone-400">
              Log in or create an account to unlock exclusive content, private videos, fan community
              discussion prompts, and early merch access.
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
