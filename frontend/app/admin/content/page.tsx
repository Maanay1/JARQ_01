"use client";

import Link from "next/link";
import { BookOpen, FilePlus2, PencilLine, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AdminShell } from "@/components/admin/AdminShell";

const contentActions = [
  { title: "Добавить курс", text: "Создай новый learning path для английского или программирования.", icon: FilePlus2 },
  { title: "Исправить урок", text: "Открой урок, измени вопросы, подсказки и реплики Мааная.", icon: PencilLine },
  { title: "AI генерация", text: "Подготовь структуру урока по промпту MAANAY JSON.", icon: Sparkles },
  { title: "Каталог уроков", text: "Быстрый переход к статистике и списку уроков.", icon: BookOpen, href: "/admin/lessons" },
];

export default function AdminContentPage() {
  return (
    <AdminShell title="Контент" eyebrow="Редактор материалов">
      <section className="grid gap-4 md:grid-cols-2">
        {contentActions.map((item, index) => {
          const Icon = item.icon;
          const card = (
            <motion.article
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 26, delay: index * 0.05 }}
              className="min-h-48 rounded-[32px] p-5 liquid-glass"
            >
              <div className="grid h-14 w-14 place-items-center rounded-[24px] bg-cyan-300/15 text-cyan-100">
                <Icon size={26} />
              </div>
              <h2 className="mt-5 text-2xl font-black">{item.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed jarq-muted">{item.text}</p>
              <div className="mt-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100">Скоро: визуальный редактор</div>
            </motion.article>
          );
          return item.href ? (
            <Link key={item.title} href={item.href}>
              {card}
            </Link>
          ) : (
            <div key={item.title}>{card}</div>
          );
        })}
      </section>
    </AdminShell>
  );
}
