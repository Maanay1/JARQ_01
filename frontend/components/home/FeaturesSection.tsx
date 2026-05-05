import { features } from "@/components/home/home-data";

export function FeaturesSection() {
  return (
    <section className="border-b px-4 py-12 sm:px-6 sm:py-16 lg:px-8 jarq-border">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Преимущества</div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">То, что делает обучение живым</h2>
        </div>

        <div className="mt-8 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="button-lift min-w-0 rounded-xl p-4 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/15 sm:rounded-2xl sm:p-5 jarq-glass"
              >
                <div className={`grid h-11 w-11 place-items-center rounded-md ${feature.color}`}>
                  <Icon size={21} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 jarq-muted">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
