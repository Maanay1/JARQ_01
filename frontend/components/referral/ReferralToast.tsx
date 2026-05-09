"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { popReferralNotification } from "@/lib/referral";

export function ReferralToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const nextMessage = popReferralNotification();
    if (!nextMessage) return;
    setMessage(nextMessage);
    const timeout = window.setTimeout(() => setMessage(null), 5200);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="fixed left-4 right-4 top-4 z-[120] mx-auto max-w-md rounded-[28px] border border-cyan-300/25 bg-slate-950/80 p-4 text-sm font-black text-cyan-50 shadow-[0_8px_34px_rgba(34,211,238,.2)] backdrop-blur-2xl"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
