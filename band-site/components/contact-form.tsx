"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui";
import { siteMeta, socialLinks } from "@/data/site";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Sending...");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error ?? "Submission failed.");
      return;
    }

    setStatus("Message sent successfully.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <GlassCard id="form">
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Contact Form</p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
          Send a message
        </h2>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <input
            className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
            placeholder="Subject"
            value={form.subject}
            onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
          />
          <textarea
            className="min-h-40 rounded-[28px] border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
            placeholder="Message"
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          />
          <button
            type="submit"
            className="rounded-full bg-[#f4c66a] px-6 py-4 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
          >
            Submit
          </button>
        </form>
        {status ? <p className="mt-4 text-sm text-stone-300">{status}</p> : null}
      </GlassCard>

      <GlassCard id="management" className="grid gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Management Contact</p>
          <p className="mt-4 text-2xl text-white">{siteMeta.email}</p>
          <p className="mt-3 text-sm leading-7 text-stone-400">
            For management, booking, media requests, sync licensing, and brand partnerships.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Social links</p>
          <div className="mt-4 grid gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-stone-300 transition hover:text-[#f4c66a]"
              >
                {link.label} · {link.handle}
              </a>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
