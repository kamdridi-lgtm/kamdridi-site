"use client";

import { useState } from "react";

type SubmitState = {
  type: "idle" | "loading" | "success" | "error";
  message: string;
};

export function LabelApplyPortal() {
  const [state, setState] = useState<SubmitState>({ type: "idle", message: "" });

  async function submit(formData: FormData) {
    setState({ type: "loading", message: "Submitting application..." });
    formData.set("contractAccepted", formData.get("contractAccepted") === "on" ? "true" : "false");
    const response = await fetch("/api/label/applications", { method: "POST", body: formData });
    const payload = await response.json();

    if (!response.ok) {
      setState({ type: "error", message: payload.error || "Submission failed." });
      return;
    }

    if (payload.url) {
      window.location.href = payload.url;
      return;
    }

    setState({
      type: "success",
      message: payload.message || "Application submitted. Status: Pending Review."
    });
  }

  return (
    <form action={submit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <input name="artistName" required placeholder="Artist / band name" className="label-input" />
        <input name="legalName" required placeholder="Legal name" className="label-input" />
        <input name="email" required type="email" placeholder="Email" className="label-input md:col-span-2" />
      </div>
      <textarea name="bio" required rows={5} placeholder="Short artist bio and what you want to build with KAMDRIDI RECORDS" className="label-input resize-none" />
      <input name="links" required placeholder="Spotify, SoundCloud, YouTube, website, EPK links" className="label-input" />
      <div className="grid gap-5 md:grid-cols-2">
        <label className="label-upload">
          <span>Demo audio 1</span>
          <input name="demo1" required type="file" accept="audio/*" />
        </label>
        <label className="label-upload">
          <span>Demo audio 2</span>
          <input name="demo2" required type="file" accept="audio/*" />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm leading-6 text-stone-300">
        <input name="contractAccepted" type="checkbox" required className="mt-1" />
        I accept the digital submission agreement: 70% Artist / 30% Label, 24-month review/distribution term for approved releases.
      </label>
      <button type="submit" disabled={state.type === "loading"} className="rounded-full bg-[#f4c66a] px-7 py-4 text-xs font-bold uppercase tracking-[0.24em] text-black transition hover:bg-[#ffd989] disabled:opacity-60">
        Submit + Pay Label Fee
      </button>
      {state.message ? (
        <p className={state.type === "error" ? "text-sm text-red-200" : "text-sm text-emerald-200"}>{state.message}</p>
      ) : null}
    </form>
  );
}
