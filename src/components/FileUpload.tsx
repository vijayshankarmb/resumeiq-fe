"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  error?: string;
}

export function FileUpload({
  onFileSelect,
  accept = "application/pdf",
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  error,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const validate = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        setFileError("File must be under 5MB");
        return false;
      }
      if (accept && !file.type.match(accept.replace("*", ".*"))) {
        setFileError("Only PDF files are allowed");
        return false;
      }
      setFileError(null);
      return true;
    },
    [maxSize, accept]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file && validate(file)) onFileSelect(file);
    },
    [disabled, onFileSelect, validate]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validate(file)) onFileSelect(file);
      e.target.value = "";
    },
    [onFileSelect, validate]
  );

  const displayError = error || fileError;

  return (
    <div className="w-full">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed
          transition-all duration-200
          ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[var(--primary)]"}
          ${isDragOver ? "upload-zone-active border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--card-border)]"}
          ${displayError ? "border-red-500/60" : ""}
        `}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        <svg
          className="mb-3 h-12 w-12 text-[var(--muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mb-1 text-sm font-medium text-[var(--foreground)]">
          {isDragOver ? "Drop your resume here" : "Drag & drop or click to upload"}
        </p>
        <p className="text-xs text-[var(--muted)]">PDF only, max 5MB</p>
      </label>
      {displayError && (
        <p className="mt-2 text-sm text-red-500">{displayError}</p>
      )}
    </div>
  );
}
