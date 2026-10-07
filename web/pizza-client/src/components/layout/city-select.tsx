"use client";

import { MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cities } from "@/data/products";
import { useAuth } from "@/store/auth-store";
import { useMounted } from "@/hooks/use-mounted";

export function CitySelect() {
  const mounted = useMounted();
  const city = useAuth((s) => s.city);
  const setCity = useAuth((s) => s.setCity);

  return (
    <Select value={mounted ? city : "Mumbai"} onValueChange={setCity}>
      <SelectTrigger
        aria-label="Select city"
        className="h-8 gap-1 border-0 bg-transparent px-2 text-sm font-medium shadow-none hover:bg-muted"
      >
        <MapPin className="!size-3.5 !opacity-100 text-primary" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {cities.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
