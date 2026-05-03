import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4">
      <div className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-semibold shadow-soft">
        <Loader2 className="animate-spin text-coral" size={18} />
        Loading JARQ...
      </div>
    </main>
  );
}
