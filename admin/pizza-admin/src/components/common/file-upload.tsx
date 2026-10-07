"use client";

import { useRef, useState } from "react";
import { Inbox, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_BYTES = 1024 * 1024; // 1 MB – images are stored as data URLs in localStorage

/** Figma: dashed "Click or drag file to this area to upload – Support only single file" */
export function FileUpload({
  value,
  onChange,
  className,
  invalid,
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  className?: string;
  invalid?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const read = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > MAX_BYTES) return toast.error("Image must be smaller than 1 MB");
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  if (value) {
    return (
      <div className={cn("relative grid h-44 place-items-center rounded-md border bg-muted/40", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- data URLs / local previews */}
        <img src={value} alt="Uploaded preview" className="max-h-40 max-w-full object-contain" />
        <Button type="button" size="icon-sm" variant="secondary" className="absolute top-2 right-2" onClick={() => onChange(undefined)} aria-label="Remove image">
          <X />
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        read(e.dataTransfer.files[0]);
      }}
      data-invalid={invalid || undefined}
      className={cn(
        "flex h-44 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-muted/40 text-center transition-colors hover:border-primary",
        dragging && "border-primary bg-accent",
        invalid && "border-destructive",
        className
      )}
    >
      <Inbox className="size-7 text-primary" strokeWidth={1.5} />
      <span className="text-sm">Click or drag file to this area to upload</span>
      <span className="text-xs text-muted-foreground">Support only single file (PNG, JPG, max 1 MB)</span>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => read(e.target.files?.[0])} />
    </button>
  );
}
