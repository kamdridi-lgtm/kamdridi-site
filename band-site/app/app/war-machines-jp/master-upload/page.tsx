"use client";

import { useEffect, useState } from "react";

const ENDPOINT = "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/war-machines-upload-token";

const TRACKS = [
  { id: 1, title: "War Machines", target: "01-war-machines-japan-original.wav" },
  { id: 2, title: "Too Fast Too Young", target: "02-too-fast-too-young-japan-original.wav" },
  { id: 3, title: "Our Lost Dreams", target: "03-our-lost-dreams-japan-original.wav" },
];

type State = Record<number, string>;

export default function MasterUploadPage() {
  const [token, setToken] = useState("");
  const [states, setStates] = useState<State>({});

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("token") || "";
    setToken(value);
  }, []);

  const upload = async (track: number, file?: File) => {
    if (!file || !token) return;
    setStates((prev) => ({ ...prev, [track]: "Uploading…" }));
    try {
      const res = await fetch(`${ENDPOINT}?track=${track}`, {
        method: "POST",
        headers: {
          "content-type": "application/octet-stream",
          "x-upload-token": token,
        },
        body: file,
      });
      if (!res.ok) throw new Error(await res.text());
      setStates((prev) => ({ ...prev, [track]: "Uploaded ✓" }));
    } catch (error) {
      setStates((prev) => ({ ...prev, [track]: `Failed: ${error instanceof Error ? error.message : "error"}` }));
    }
  };

  return (
    <main className="min-h-screen bg-black px-5 py-14 text-white">
      <div className="mx-auto max-w-2xl border border-red-900 bg-[#090909] p-6 sm:p-10">
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <p className="text-xs font-black tracking-[0.3em] text-red-400">KAM DRIDI • PRIVATE MASTER UPLOAD</p>
        <h1 className="mt-4 text-3xl font-black">WAR MACHINES — JAPAN</h1>
        <p className="mt-3 text-sm leading-6 text-stone-400">
          Temporary private uploader. Choose the correct WAV for each track. Files are stored in a private Supabase bucket and are not publicly exposed.
        </p>

        {!token ? (
          <div className="mt-8 border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-200">Missing upload token.</div>
        ) : (
          <div className="mt-8 space-y-4">
            {TRACKS.map((track) => (
              <div key={track.id} className="border border-stone-800 bg-black/40 p-4">
                <p className="font-black">{track.id}. {track.title}</p>
                <p className="mt-1 text-xs text-stone-500">Stored as: {track.target}</p>
                <input
                  className="mt-4 block w-full text-sm text-stone-300"
                  type="file"
                  accept=".wav,audio/wav,audio/x-wav"
                  onChange={(event) => void upload(track.id, event.currentTarget.files?.[0])}
                />
                <p className="mt-2 text-xs font-bold text-stone-400">{states[track.id] || "Waiting"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
