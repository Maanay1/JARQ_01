import { features } from "@/components/home/home-data";

export function FeaturesSection() {
  return (
    <section className="border-b px-4 py-16 sm:px-6 lg:px-8 jarq-border">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Возможности</div>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Создан как напарник в обучении</h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="button-lift rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/15 jarq-glass"
              >
                <div className={`grid h-11 w-11 place-items-center rounded-md ${feature.color}`}>
                  <Icon size={21} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
