import { personas } from "@/components/home/home-data";

export function PersonaPreviewSection() {
  return (
    <section className="border-b px-4 py-12 sm:px-6 sm:py-16 lg:px-8 jarq-border">
      <div className="mx-auto max-w-6xl">
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Личности</div>
            <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">Выбери энергию репетитора</h2>
          </div>
          <p className="max-w-md text-sm leading-6 jarq-muted">
            Каждая личность меняет то, как JARQ объясняет, реагирует, шутит и мотивирует.
          </p>
        </div>

        <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {personas.map((persona, index) => (
            <article key={persona.name} className="button-lift min-w-0 rounded-xl p-4 jarq-glass sm:rounded-2xl sm:p-5">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-cyan-300/20 text-xl font-semibold text-cyan-100">
                {index + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{persona.name}</h3>
              <div className="mt-1 text-sm font-semibold text-cyan-200">{persona.style}</div>
              <p className="mt-4 text-sm leading-6 jarq-muted">{persona.line}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
