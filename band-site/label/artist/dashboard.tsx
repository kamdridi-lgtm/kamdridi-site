"use client";

import { useEffect, useState } from "react";
import type { LabelApplication, LabelRelease } from "@/lib/label-storage";

export function LabelArtistDashboard() {
  const [artist, setArtist] = useState<LabelApplication | null>(null);
  const [releases, setReleases] = useState<LabelRelease[]>([]);
  const [analytics, setAnalytics] = useState<{ totalStreams: number; artistCents: number; annualProjectionCents: number } | null>(null);
  const [status, setStatus] = useState("");

  async function load() {
    const response = await fetch("/api/label/artist");
    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error || "Signed artist login required.");
      return;
    }
    setArtist(payload.artist);
    setReleases(payload.releases);
    const analyticsResponse = await fetch(`/api/label/analytics/${payload.artist.id}`);
    const analyticsPayload = await analyticsResponse.json();
    if (analyticsResponse.ok) setAnalytics(analyticsPayload.report);
  }

  useEffect(() => {
    void load();
  }, []);

  async function submitRelease(formData: FormData) {
    setStatus("Submitting release...");
    const response = await fetch("/api/label/releases", { method: "POST", body: formData });
    const payload = await response.json();
    setStatus(response.ok ? "Release submitted for review." : payload.error || "Release failed.");
    await load();
  }

  async function connect() {
    const response = await fetch("/api/label/connect", { method: "POST" });
    const payload = await response.json();
    if (payload.url) window.location.href = payload.url;
    else setStatus(payload.error || "Connect failed.");
  }

  if (!artist) {
    return <p className="label-panel text-sm text-stone-300">{status || "Loading artist dashboard..."}</p>;
  }

  return (
    <div className="grid gap-8">
      <div className="label-panel">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">Signed Artist</p>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">{artist.artistName}</h2>
          <p className="mt-3 text-sm text-stone-300">Virtual wallet: ${(artist.payableRoyaltiesCents / 100).toFixed(2)} CAD payable / ${(artist.generatedRoyaltiesCents / 100).toFixed(2)} generated</p>
          {analytics ? (
            <p className="mt-2 text-sm text-stone-400">
              Streams: {analytics.totalStreams.toLocaleString()} / Estimated artist share: ${(analytics.artistCents / 100).toFixed(2)} / Annual projection: ${(analytics.annualProjectionCents / 100).toFixed(2)}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`/api/label/analytics/${artist.id}?format=csv`} className="label-action label-action-muted">Export CSV</a>
          <button onClick={() => void connect()} className="label-action">Connect Stripe</button>
        </div>
      </div>

      <form action={submitRelease} className="label-panel grid gap-4">
        <h3 className="font-display text-3xl uppercase tracking-[0.08em] text-white">Submit Release</h3>
        <input name="title" required placeholder="Release title" className="label-input" />
        <div className="grid gap-4 md:grid-cols-4">
          <input name="genre" required placeholder="Genre" className="label-input" />
          <input name="featuring" placeholder="Featuring" className="label-input" />
          <input name="bpm" type="number" placeholder="BPM" className="label-input" />
          <input name="musicalKey" placeholder="Key" className="label-input" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <input name="isrc" placeholder="ISRC auto if empty" className="label-input" />
          <input name="upc" placeholder="UPC auto if empty" className="label-input" />
          <input name="releaseDate" required type="date" className="label-input" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="label-upload"><span>WAV master</span><input name="wav" required type="file" accept="audio/wav,audio/*" /></label>
          <label className="label-upload"><span>Cover art</span><input name="cover" required type="file" accept="image/*" /></label>
        </div>
        <button className="label-action w-fit">Submit Release</button>
      </form>

      <div className="grid gap-4">
        {releases.map((release) => (
          <div key={release.id} className="label-panel">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">{release.status}</p>
              <h3 className="mt-2 text-xl font-bold text-white">{release.title}</h3>
              <p className="mt-2 text-sm text-stone-400">ISRC {release.isrc} / UPC {release.upc} / {release.releaseDate}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                Master: {release.wav.storageMode || "metadata"} / Cover: {release.cover.storageMode || "metadata"}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {release.wav.url && !release.wav.url.startsWith("simulation://") ? <a className="text-xs uppercase tracking-[0.18em] text-[#f4c66a]" href={release.wav.url}>Open master</a> : null}
                {release.cover.url && !release.cover.url.startsWith("simulation://") ? <a className="text-xs uppercase tracking-[0.18em] text-[#f4c66a]" href={release.cover.url}>Open cover</a> : null}
              </div>
            </div>
          </div>
        ))}
        {!releases.length ? <p className="text-sm text-stone-500">No release submitted yet.</p> : null}
      </div>
      {status ? <p className="text-sm text-[#f4c66a]">{status}</p> : null}
    </div>
  );
}
