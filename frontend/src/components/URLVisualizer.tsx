"use client";

import { Network } from "lucide-react";
import type { URLParts } from "@/types/prediction";

interface URLVisualizerProps {
  urlParts: URLParts;
}

export default function URLVisualizer({ urlParts }: URLVisualizerProps) {
  // Determine if specific segments look heavily suspicious (for coloring)
  const isSuspiciousDomain = urlParts.domain.includes("-") || /\d/.test(urlParts.domain);
  const hasTooManySubdomains = urlParts.subdomain && urlParts.subdomain.split('.').length > 2;

  return (
    <div className="surface-panel rounded-[28px] border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-2xl bg-cyan-400/15 p-2.5 text-cyan-300">
          <Network className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            URL Structure Analysis
          </p>
          <h3 className="mt-1 text-xl font-semibold text-white">
            Segment Breakdown
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-2">Protocol</span>
          <span className={`text-base font-medium break-all ${urlParts.protocol === "https" ? "text-emerald-400" : "text-red-400"}`}>
            {urlParts.protocol}://
          </span>
        </div>

        {urlParts.subdomain && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-2">Subdomain</span>
            <span className={`text-base font-medium break-all ${hasTooManySubdomains ? "text-orange-400" : "text-slate-200"}`}>
              {urlParts.subdomain}
            </span>
          </div>
        )}

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-2">Domain</span>
          <span className={`text-base font-medium break-all ${isSuspiciousDomain ? "text-orange-400" : "text-slate-200"}`}>
            {urlParts.domain}.{urlParts.tld}
          </span>
        </div>

        {urlParts.path && urlParts.path !== "/" && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-2">Path</span>
            <span className="text-base font-medium text-slate-400 break-all">
              {urlParts.path}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
