"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

export default function InstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPrompt(event as BeforeInstallPromptEvent);
      setShow(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-[70px] left-4 right-4 z-[1000] flex items-center justify-between gap-3 rounded-[16px] border border-cyan-300/60 bg-[#0a1628]/95 p-4 shadow-[0_14px_42px_rgba(0,229,255,0.18)] backdrop-blur-xl md:hidden">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#e8f4ff]">Установить JARQ</p>
        <p className="mt-0.5 text-xs text-[#8aa5c4]">Добавить на экран как приложение</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setShow(false)}
          className="min-h-9 rounded-[10px] border border-[#1a3050] bg-transparent px-3 text-xs font-semibold text-[#8aa5c4]"
        >
          Нет
        </button>
        <button
          type="button"
          onClick={() => {
            void prompt?.prompt();
            setShow(false);
          }}
          className="min-h-9 rounded-[10px] bg-[#00e5ff] px-3 text-xs font-bold text-[#040810]"
        >
          Установить
        </button>
      </div>
    </div>
  );
}
