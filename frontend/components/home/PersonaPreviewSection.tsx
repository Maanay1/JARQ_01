import { personas } from "@/components/home/home-data";

export function PersonaPreviewSection() {
  return (
    <section className="border-b px-4 py-16 sm:px-6 lg:px-8 jarq-border">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Личности</div>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Выбери энергию репетитора</h2>
          </div>
          <p className="max-w-md text-sm leading-6 jarq-muted">
            Каждая личность меняет то, как JARQ объясняет, реагирует, шутит и мотивирует.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {personas.map((persona, index) => (
            <article key={persona.name} className="button-lift rounded-2xl p-5 jarq-glass">
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
