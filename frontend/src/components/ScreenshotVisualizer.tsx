"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, TextSearch, Fingerprint } from "lucide-react";

interface ScreenshotVisualizerProps {
  ocrText?: string;
  fakeLoginDetected?: boolean;
  brandImpersonation?: string | null;
}

export default function ScreenshotVisualizer({
  ocrText,
  fakeLoginDetected,
  brandImpersonation,
}: ScreenshotVisualizerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel mt-6 rounded-[24px] border border-white/10 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl bg-cyan-400/15 p-2 text-cyan-300">
          <ImageIcon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-white">Visual Analysis</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fakeLoginDetected && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-2">
              <Fingerprint className="h-3 w-3" />
              Impersonation Match
            </p>
            <p className="text-white text-sm">
              Detected fake <strong>{brandImpersonation}</strong> login portal.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <TextSearch className="h-3 w-3" />
            Extracted OCR Text
          </p>
          <div className="bg-[#0a0a0f] p-3 rounded-lg border border-white/5 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
            {ocrText || "No readable text detected in the image."}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
