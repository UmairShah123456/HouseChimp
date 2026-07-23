import type { ReactNode } from "react";

const inputClass =
  "w-full rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent placeholder:text-muted";

/** Labeled text input / textarea used throughout the dashboard forms. */
export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  textarea,
  rows = 3,
  hint,
  children,
}: {
  label?: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  hint?: string;
  children?: ReactNode;
}) {
  return (
    <label className="mt-3 flex flex-col gap-1.5 first:mt-0">
      {label && <span className="text-[13px] font-semibold text-ink">{label}</span>}
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputClass}
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          type={type}
          required={required}
          className={inputClass}
        />
      )}
      {hint && <span className="text-xs text-muted">{hint}</span>}
      {children}
    </label>
  );
}
