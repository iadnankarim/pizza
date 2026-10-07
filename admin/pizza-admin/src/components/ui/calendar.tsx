"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
        button_previous: cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "z-10"),
        button_next: cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "z-10"),
        month_caption: "flex h-7 items-center justify-center text-sm font-medium",
        weekdays: "flex",
        weekday: "w-8 text-[0.75rem] font-normal text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "size-8 p-0 text-center text-sm",
        day_button: "size-8 rounded-md hover:bg-accent aria-selected:opacity-100",
        selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary",
        today: "[&>button]:font-semibold [&>button]:text-primary",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === "left" ? <ChevronLeft className="size-4" {...rest} /> : <ChevronRight className="size-4" {...rest} />,
      }}
      {...props}
    />
  );
}

export { Calendar };
