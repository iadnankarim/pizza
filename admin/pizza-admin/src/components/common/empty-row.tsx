import { TableCell, TableRow } from "@/components/ui/table";

export function EmptyRow({ colSpan, message = "Nothing found. Try a different search or filter." }: { colSpan: number; message?: string }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="py-16 text-center text-sm text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  );
}
