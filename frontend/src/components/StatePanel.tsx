"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock3, Shield, WifiOff } from "lucide-react";

type StateVariant = "empty" | "loading" | "error";

interface StatePanelProps {
  title: string;
  description: string;
  variant: StateVariant;
  details?: string;
}

const variantMap = {
  empty: {
    icon: Shield,
    accent: "from-cyan-400/20 via-sky-500/10 to-transparent",
    iconClass: "text-cyan-200",
  },
  loading: {
    icon: Clock3,
    accent: "from-blue-400/20 via-indigo-500/10 to-transparent",
    iconClass: "text-blue-200",
  },
  error: {
    icon: WifiOff,
    accent: "from-rose-400/20 via-orange-500/10 to-transparent",
    iconClass: "text-rose-200",
  },
} satisfies Record<
  StateVariant,
  { icon: typeof Shield; accent: string; iconClass: string }
>;

export default function StatePanel({
  title,
  description,
  variant,
  details,
}: StatePanelProps) {
  const { icon: Icon, accent, iconClass } = variantMap[variant];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-panel relative overflow-hidden rounded-[28px] border border-white/10 p-6 sm:p-8"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Icon className={`h-6 w-6 ${iconClass}`} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:max-w-md">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="mb-2 font-medium text-white">What you&apos;ll get</div>
            <p>
              Clear risk scoring, feature-level evidence, and a plain-English
              explanation.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-white">
              <AlertTriangle className="h-4 w-4 text-amber-300" />
              Status guidance
            </div>
            <p>{details ?? "Submit a URL to begin a full phishing assessment."}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
