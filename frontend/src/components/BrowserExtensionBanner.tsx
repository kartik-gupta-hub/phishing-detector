"use client";

import { Globe, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function BrowserExtensionBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full overflow-hidden border-b border-white/10 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 px-4 py-3"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="mx-auto flex max-w-7xl items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
            <Globe className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-slate-300 hidden sm:block">
            <span className="text-white font-bold mr-1 flex items-center gap-1 inline-flex">
              <Sparkles className="h-3 w-3 text-purple-400" />
              New
            </span>
            PhishGuard AI Browser Extension is now in Beta. Get real-time protection.
          </p>
          <p className="text-sm font-medium text-slate-300 sm:hidden">
            Get the Browser Extension.
          </p>
        </div>
        <button className="group flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-300">
          Install Extension
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
