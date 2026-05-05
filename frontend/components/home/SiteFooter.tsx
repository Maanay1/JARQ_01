import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t pt-8 jarq-border sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-lg font-bold tracking-[0.16em] jarq-text">JARQ</div>
          <p className="mt-2 text-sm jarq-muted">AI репетитор для живого обучения, экспо и реальной практики.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold jarq-muted">
          <Link className="hover:text-cyan-200" href="/courses">
            Курсы
          </Link>
          <Link className="hover:text-cyan-200" href="/chat">
            Чат
          </Link>
          <Link className="hover:text-cyan-200" href="/courses/programming">
            Программирование
          </Link>
        </div>
      </div>
    </footer>
  );
}
