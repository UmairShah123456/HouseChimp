"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Status = "idle" | "uploading" | "error";

/**
 * Uploads an image or video to Supabase Storage and returns its public URL.
 * Shows an in-flight state and surfaces failures instead of silently dropping.
 */
export function MediaUploader({
  bucket = "media",
  pathPrefix,
  accept = "image/*",
  value,
  onUploaded,
  label = "Upload",
  kind = "image",
}: {
  bucket?: string;
  pathPrefix: string;
  accept?: string;
  value?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
  kind?: "image" | "video";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setStatus("uploading");
    setError("");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onUploaded(data.publicUrl);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {value ? (
          kind === "video" ? (
            <video src={value} className="h-16 w-24 rounded-[var(--radius-sm)] bg-black object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-16 w-24 rounded-[var(--radius-sm)] border border-border object-cover" />
          )
        ) : (
          <div className="placeholder-tile h-16 w-24 rounded-[var(--radius-sm)]" />
        )}

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="rounded-[var(--radius-pill)] border-[1.5px] border-border bg-surface px-3.5 py-2 text-[13px] font-bold text-ink disabled:opacity-60"
          >
            {status === "uploading" ? "Uploading…" : value ? "Replace" : label}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onUploaded("")}
              className="text-left text-xs font-semibold text-muted hover:text-danger"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {status === "error" && (
        <p className="text-xs font-semibold text-danger">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
