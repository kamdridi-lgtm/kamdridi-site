"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileAudio, FileImage, FileText, CheckCircle2, Copy } from "lucide-react";

type UploadedFile = {
  name: string;
  url: string;
  size: number;
  type: string;
};

export default function MediaManagerPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed. Check Vercel Blob configuration.");
      }

      const data = await res.json();
      setUploadedFiles((prev) => [
        { name: data.name, url: data.url, size: data.size, type: file.type },
        ...prev,
      ]);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white md:py-24">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/label/admin"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#f4c66a] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="mb-12 border-b border-[#f4c66a]/20 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.45em] text-[#f4c66a]">
            Content Management
          </p>
          <h1 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.06em] md:text-5xl">
            Media Manager
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
            Upload final audio masters, album covers, and product photos directly to Vercel Blob. 
            Once uploaded, copy the URL to embed the asset in your Commerce Products or Music Player.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Zone */}
          <div
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
              isDragging
                ? "border-[#f4c66a] bg-[#f4c66a]/5"
                : "border-white/10 bg-black/20 hover:border-white/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
            />
            <UploadCloud className={`mb-4 h-12 w-12 ${isDragging ? "text-[#f4c66a]" : "text-stone-500"}`} />
            <h3 className="text-lg font-bold uppercase tracking-widest text-white">
              {isUploading ? "Uploading Signal..." : "Drop Media Here"}
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              or click to browse your files (Audio, Images, Video)
            </p>
          </div>

          {/* Uploaded Files List */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm uppercase tracking-widest text-stone-400 border-b border-white/10 pb-2">
              Recent Uploads
            </h3>
            {uploadedFiles.length === 0 ? (
              <p className="text-sm text-stone-500">No media uploaded in this session.</p>
            ) : (
              uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-center gap-4 truncate">
                    {file.type.startsWith("audio") ? (
                      <FileAudio className="h-6 w-6 text-blue-400 shrink-0" />
                    ) : file.type.startsWith("image") ? (
                      <FileImage className="h-6 w-6 text-green-400 shrink-0" />
                    ) : (
                      <FileText className="h-6 w-6 text-stone-400 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="truncate text-sm font-bold text-stone-200">{file.name}</p>
                      <p className="text-xs text-stone-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#f4c66a]" />
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      className="flex items-center gap-2 rounded bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-300 transition hover:bg-white/10"
                    >
                      <Copy className="h-3 w-3" /> URL
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
