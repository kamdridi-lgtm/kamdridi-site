"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui";
import {
  fanClubHubSections,
  gameExperiences,
  membershipTiers,
  privateVault,
  siteMeta
} from "@/data/site";
import { useApp } from "@/components/providers";

type VaultResponse = {
  intro: string;
  videos: string[];
  communityTopics: string[];
  accessNotes: string[];
};

const memberQuickLinks = [
  {
    id: "fan-link-games",
    title: "Games Protocol",
    description: "Launch The Gilded Null and move deeper into the protocol archive.",
    href: "/games"
  },
  {
    id: "fan-link-comic",
    title: "Who Is Kam Dridi",
    description: "Open the comic reader and continue through the visual lore sequence.",
    href: "/who-is-kam-dridi"
  },
  {
    id: "fan-link-store",
    title: "Early Merch Access",
    description: "Jump directly into the official merch wall and collector drops.",
    href: "/store"
  },
  {
    id: "fan-link-media",
    title: "Visual Album",
    description: "Continue through the connected media and scene-driven album world.",
    href: "/visual-album"
  }
] as const;

export function FanClubPanel({
  membershipCheckoutLive
}: {
  membershipCheckoutLive: boolean;
}) {
  const { fan, setFan } = useApp();
  const [signup, setSignup] = useState({ name: "", email: "", password: "" });
  const [login, setLogin] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<string | null>(null);
  const [vault, setVault] = useState<VaultResponse | null>(null);
  const handledMembershipState = useRef<string | null>(null);
  const liveTierCount = membershipTiers.filter((tier) => Boolean(tier.checkoutUrl)).length;

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
      setStatus("Membership checkout was cancelled. You can return here or request access directly.");
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
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{tier.name}</p>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.24em]">
                <span className="rounded-full border border-[#f4c66a]/30 bg-[#f4c66a]/10 px-3 py-1 text-[#f4c66a]">
                  {tier.id === "collector-membership" ? "Full Archive" : "First Protocol"}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 ${
                    tier.checkoutUrl
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100"
                      : "border-white/10 text-stone-400"
                  }`}
                >
                  {tier.checkoutUrl ? "Hosted Checkout" : "Direct Request"}
                </span>
              </div>
            </div>
            <p className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-white">
              {tier.priceLabel}
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-400">{tier.description}</p>
            <div className="mt-6 grid gap-2">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-stone-300">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#f4c66a]" />
                  <p>{feature}</p>
                </div>
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
                  {tier.checkoutLabel ?? "Join via Checkout"}
                </a>
              ) : (
                <a
                  href={tier.requestUrl}
                  className="inline-flex rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[0.25em] text-stone-300 transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"
                >
                  {tier.requestLabel ?? "Request Access"}
                </a>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {fanClubHubSections.map((section) => (
          <GlassCard key={section.id} id={`${section.id}-card`}>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{section.title}</p>
            <p className="mt-4 text-sm leading-7 text-stone-400">{section.description}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Membership Checkout</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-400">
          {membershipCheckoutLive
            ? "Membership tiers use secure hosted checkout when a live payment link is available. If a tier is temporarily closed, use the direct request link shown on that membership card."
            : `Hosted membership billing is not active in this environment. Use the request links on each tier or email ${siteMeta.email} directly while site accounts remain active for vault and preview access.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.24em] text-stone-400">
          <span className="rounded-full border border-[#f4c66a]/35 bg-[#f4c66a]/10 px-4 py-2 text-[#f4c66a]">
            {membershipCheckoutLive
              ? `${liveTierCount} live membership tier${liveTierCount === 1 ? "" : "s"}`
              : "Request-based memberships"}
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2">Private vault</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Game access</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Early merch access</span>
        </div>
        {status ? <p className="mt-4 text-sm text-emerald-200">{status}</p> : null}
      </GlassCard>

      <div id="game-access" className="grid gap-6 lg:grid-cols-2">
        {gameExperiences.map((game) => (
          <GlassCard key={game.id} className="overflow-hidden p-0">
            <div className="relative h-72">
              <Image src={game.poster} alt={`${game.title} official poster`} fill className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.88))]" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{game.title}</p>
                <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">
                  {game.subtitle}
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm leading-7 text-stone-400">{game.description}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.25em] text-stone-400">
                <span className="rounded-full border border-white/10 px-3 py-2">{game.membership}</span>
                {game.comingSoon ? (
                  <span className="rounded-full border border-[#f4c66a]/30 bg-[#f4c66a]/10 px-3 py-2 text-[#f4c66a]">
                    Collector Preview
                  </span>
                ) : null}
              </div>
              <a
                href={game.launchUrl}
                target={game.launchUrl.startsWith("/") ? undefined : "_blank"}
                rel={game.launchUrl.startsWith("/") ? undefined : "noreferrer"}
                className="mt-8 inline-flex rounded-full bg-[#f4c66a] px-6 py-4 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
              >
                {game.launcherLabel}
              </a>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-6">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Member Routing</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Vault, games, merch, and comic access
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              Membership and site account access are separate on purpose: billing opens the tier,
              while your site account controls the private session you use inside the KAMDRIDI
              universe.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {memberQuickLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="rounded-[24px] border border-white/10 bg-black/30 p-5 transition hover:border-[#f4c66a]/40 hover:bg-[#f4c66a]/5"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-[#f4c66a]">{link.title}</p>
                  <p className="mt-3 text-sm leading-7 text-stone-400">{link.description}</p>
                </a>
              ))}
            </div>
          </GlassCard>

          <GlassCard id="account-access">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Fan Account</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Login or create an account
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              Site accounts control the vault, game access, and member session inside this site.
              {membershipCheckoutLive
                ? " Hosted billing can run separately from the account you use here."
                : " Membership requests are currently handled directly, while the account you create here still controls your private site session."}
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
                required
                value={signup.name}
                onChange={(event) =>
                  setSignup((current) => ({ ...current, name: event.target.value }))
                }
              />
              <input
                className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
                type="email"
                placeholder="Email"
                required
                value={signup.email}
                onChange={(event) =>
                  setSignup((current) => ({ ...current, email: event.target.value }))
                }
              />
              <input
                className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
                type="password"
                placeholder="Password"
                required
                minLength={8}
                value={signup.password}
                onChange={(event) =>
                  setSignup((current) => ({ ...current, password: event.target.value }))
                }
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
                required
                value={login.email}
                onChange={(event) => setLogin((current) => ({ ...current, email: event.target.value }))}
              />
              <input
                className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
                type="password"
                placeholder="Password"
                required
                value={login.password}
                onChange={(event) =>
                  setLogin((current) => ({ ...current, password: event.target.value }))
                }
              />
              <button
                type="submit"
                className="rounded-full border border-white/10 px-6 py-4 text-xs uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"
              >
                Login
              </button>
            </form>
            {fan ? (
              <div className="mt-5 grid gap-4">
                <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100">
                  Logged in as {fan.name} ({fan.email})
                </div>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="w-fit text-sm text-stone-400 transition hover:text-[#f4c66a]"
                >
                  Logout {fan.name}
                </button>
              </div>
            ) : null}
          </GlassCard>
        </div>

        <GlassCard id="vault">
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Exclusive Content</p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
            Private videos, vault access, and collector channels
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-400">{privateVault.intro}</p>
          <div className="mt-6 grid gap-3">
            {privateVault.accessNotes.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-[#f4c66a]/15 bg-[#f4c66a]/5 p-4 text-sm text-stone-300"
              >
                {note}
              </div>
            ))}
          </div>

          {fan && vault ? (
            <div className="mt-8 grid gap-6">
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100">
                Welcome back, {fan.name}. Your site account is active.
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Private videos</p>
                <div className="mt-4 grid gap-3">
                  {vault.videos.map((video) => (
                    <div
                      key={video}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-stone-200"
                    >
                      {video}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Fan community</p>
                <div className="mt-4 grid gap-3">
                  {vault.communityTopics.map((topic) => (
                    <div
                      key={topic}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-stone-200"
                    >
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 rounded-3xl border border-dashed border-white/15 bg-black/20 p-8 text-sm leading-7 text-stone-400">
              <p>
                Log in or create an account to unlock exclusive content, private videos, fan
                community discussion prompts, game protocol updates, comic access, and early merch
                access.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {privateVault.videos.slice(0, 2).map((video) => (
                  <div
                    key={video}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-stone-300"
                  >
                    Preview: {video}
                  </div>
                ))}
                {privateVault.communityTopics.slice(0, 2).map((topic) => (
                  <div
                    key={topic}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-stone-300"
                  >
                    Community: {topic}
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
