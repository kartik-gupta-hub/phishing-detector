"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface FeatureBreakdownProps {
  features: Record<string, number>;
}

export default function FeatureBreakdown({ features }: FeatureBreakdownProps) {
  const definitions = [
    {
      key: "url_length",
      label: "URL Length",
      description: "Long URLs often hide deceptive paths or tracking fragments.",
      safeLimit: 75,
      type: "number",
    },
    {
      key: "num_subdomains",
      label: "Subdomains",
      description: "Unusually deep subdomains can be used to mimic trusted brands.",
      safeLimit: 3,
      type: "number",
    },
    {
      key: "has_at_symbol",
      label: "Contains '@' Symbol",
      description: "The @ symbol can obscure the real destination in phishing URLs.",
      safeValue: 0,
      type: "boolean",
    },
    {
      key: "has_dash",
      label: "Domain Contains Dash",
      description: "Hyphenated domains are frequently used in impersonation campaigns.",
      safeValue: 0,
      type: "boolean",
    },
    {
      key: "is_https",
      label: "Uses HTTPS",
      description: "A missing HTTPS connection weakens trust and transport security.",
      safeValue: 1,
      type: "boolean",
    },
    {
      key: "has_ip",
      label: "IP Instead of Domain",
      description: "Direct IP addresses are uncommon for legitimate login experiences.",
      safeValue: 0,
      type: "boolean",
    },
    {
      key: "has_iframe",
      label: "Hidden Iframes",
      description: "Iframes can be used to mask or inject deceptive content layers.",
      safeValue: 0,
      type: "boolean",
    },
    {
      key: "empty_form_actions",
      label: "Suspicious Form Submissions",
      description: "Missing or suspicious form destinations can indicate credential harvesting.",
      safeValue: 0,
      type: "boolean",
    },
    {
      key: "hidden_elements",
      label: "Obfuscated/Hidden Elements",
      description: "Concealed elements can signal attempts to evade inspection.",
      safeValue: 0,
      type: "boolean",
    },
    {
      key: "redirect_behavior",
      label: "Excessive Redirects",
      description: "Heavy redirection can hide the final landing page from users.",
      safeValue: 0,
      type: "boolean",
    },
  ];

  return (
    <div className="surface-panel h-full rounded-[28px] border border-white/10 p-6 sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Detection signals
          </p>
          <h3 className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
            <Info className="h-5 w-5 text-cyan-300" />
            Feature Analysis
          </h3>
        </div>
        <div className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
          {definitions.filter((def) => features[def.key] !== undefined).length} checks surfaced
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {definitions.map((def, idx) => {
          const val = features[def.key];
          if (val === undefined) return null;
          
          let isDanger = false;
          let displayVal = "";
          
          if (def.type === "number") {
             isDanger = val > (def.safeLimit as number);
             displayVal = val.toFixed(0);
          } else {
             isDanger = val !== def.safeValue;
             displayVal = val === 1 ? "Yes" : "No";
          }

          return (
            <motion.div 
              key={def.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * idx }}
              className={`rounded-2xl border p-4 ${
                isDanger
                  ? "border-red-400/20 bg-red-500/10"
                  : "border-emerald-400/15 bg-emerald-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-white">{def.label}</div>
                  <p className="text-sm leading-6 text-slate-400">{def.description}</p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                    isDanger
                      ? "bg-red-400/10 text-red-200"
                      : "bg-emerald-400/10 text-emerald-200"
                  }`}
                >
                  {isDanger ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {isDanger ? "Review" : "Normal"}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/8 bg-slate-950/35 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Observed value
                </span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {displayVal}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
