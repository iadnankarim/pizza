import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Input with a trailing addon – "₹" for prices, "%" for coupons */
export function InputWithSuffix({ suffix, className, ...props }: React.ComponentProps<typeof Input> & { suffix: string }) {
  return (
    <div className={cn("flex", className)}>
      <Input className="rounded-r-none" {...props} />
      <span className="grid min-w-9 place-items-center rounded-r-md border border-l-0 border-input bg-muted px-2 text-xs text-muted-foreground">
        {suffix}
      </span>
    </div>
  );
}
