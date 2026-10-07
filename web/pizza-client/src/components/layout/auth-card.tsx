import { Lock } from "lucide-react";

export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-8">
        <h1 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <Lock className="size-4" /> {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
