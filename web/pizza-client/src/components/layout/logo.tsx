import Link from "next/link";
import { Pizza } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight" aria-label="Pizza home">
      <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
        <Pizza className="size-5" />
      </span>
      <span>pizza</span>
    </Link>
  );
}
