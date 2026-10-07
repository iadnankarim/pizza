import Image from "next/image";
import { cn } from "@/lib/utils";

/** Small product/topping image; supports both /public paths and uploaded data URLs */
export function Thumb({ src, alt = "", className }: { src?: string; alt?: string; className?: string }) {
  if (!src) return <span className={cn("block size-9 rounded-md bg-muted", className)} />;
  return <Image src={src} alt={alt} width={40} height={40} unoptimized={src.startsWith("data:")} className={cn("size-9 object-contain", className)} />;
}
