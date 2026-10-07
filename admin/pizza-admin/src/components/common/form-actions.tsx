"use client";

import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Figma: coral "Save" + plain "Cancel" in the top-right of create pages */
export function FormActions({ form, pending }: { form: string; pending?: boolean }) {
  const router = useRouter();
  return (
    <>
      <Button type="submit" form={form} size="sm" disabled={pending}>
        <Save /> Save
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => router.back()}>
        Cancel
      </Button>
    </>
  );
}
