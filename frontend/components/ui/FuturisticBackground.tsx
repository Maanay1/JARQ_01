"use client";

export function FuturisticBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#05080b]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(24,220,200,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(24,220,200,0.035)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
      <div className="absolute left-24 top-0 h-72 w-96 bg-cyan-300/[0.055] blur-3xl" />
      <div className="absolute right-0 top-1/4 h-80 w-80 bg-blue-500/[0.045] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(24,220,200,0.12),transparent_30%),linear-gradient(180deg,rgba(5,8,11,0.18),#05080b_88%)]" />
    </div>
  );
}
