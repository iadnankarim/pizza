"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/** Shared "Basic info" / "Security info" field grids for Create User and Profile */
export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} autoComplete={autoComplete} placeholder={placeholder} {...field} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
