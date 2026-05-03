import { MessageCircle } from "lucide-react";
import { demoMessages } from "@/components/home/home-data";

export function DemoChatSection() {
  return (
    <section id="voice-demo" className="border-b px-4 py-12 sm:px-6 sm:py-16 lg:px-8 jarq-border">
      <div className="mx-auto grid max-w-6xl min-w-0 gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Демо-чат</div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">Диалог, который помнит ученика</h2>
          <p className="mt-4 text-sm leading-6 jarq-muted">
            JARQ держит темп: сначала исправление, потом объяснение, затем маленькая практика.
          </p>
        </div>

        <div className="min-w-0 rounded-xl p-4 jarq-glass sm:rounded-2xl">
          <div className="flex items-center gap-2 border-b pb-3 text-sm font-semibold jarq-border">
            <MessageCircle size={17} />
            Живая практика английского
          </div>
          <div className="mt-4 space-y-3">
            {demoMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[94%] rounded-lg px-4 py-3 text-sm leading-6 sm:max-w-[86%] ${
                  message.role === "JARQ" ? "jarq-soft jarq-text" : "ml-auto bg-cyan-300 text-slate-950"
                }`}
              >
                <div className="mb-1 text-xs font-semibold opacity-65">{message.role}</div>
                {message.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
