"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileAudio, FileImage, FileText, CheckCircle2, Copy } from "lucide-react";
import { upload } from "@vercel/blob/client";

export function MediaWidget() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, url: string, size: number, type: string}[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError("");

    try {
      const blob = await upload(`label/uploads/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/media/upload',
      });

      setUploadedFiles(prev => [{ name: file.name, url: blob.url, size: file.size, type: file.type }, ...prev]);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  return (
    <div className="label-panel block">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs uppercase tracking-[0.28em] text-green-400">Quick Upload</p>
        <a href="/label/admin/media" className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-[#f4c66a] transition">
          Full Library &rarr;
        </a>
      </div>
      
      {error && <div className="mb-4 rounded border border-red-500/50 bg-red-500/10 p-3 text-xs text-red-500">{error}</div>}

      <div
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
          isDragging ? "border-green-400 bg-green-400/5" : "border-white/10 bg-black/20 hover:border-white/30"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) uploadFile(file); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadFile(file); }} />
        <UploadCloud className={`mb-3 h-8 w-8 ${isDragging ? "text-green-400" : "text-stone-500"}`} />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">
          {isUploading ? "Uploading Signal..." : "Drop Media"}
        </h3>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {uploadedFiles.slice(0, 3).map((file, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border border-green-400/30 bg-green-400/5 p-3">
              <div className="flex items-center gap-3 truncate">
                {file.type?.startsWith("audio") ? <FileAudio className="h-4 w-4 text-blue-400 shrink-0" /> : file.type?.startsWith("image") ? <FileImage className="h-4 w-4 text-green-400 shrink-0" /> : <FileText className="h-4 w-4 text-stone-400 shrink-0" />}
                <p className="truncate text-xs font-bold text-stone-200">{file.name}</p>
              </div>
              <button onClick={() => copyToClipboard(file.url)} className="flex items-center gap-1.5 rounded bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-white/20 shrink-0">
                <Copy className="h-3 w-3" /> Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
