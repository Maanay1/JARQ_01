"use client";

import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  suffix?: string;
  className?: string;
};

export function AnimatedNumber({ value, suffix = "", className }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startedAt = performance.now();
    let frame = 0;

    function tick(now: number) {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className={className}>
      {displayValue.toLocaleString("ru")}
      {suffix}
    </span>
  );
}
