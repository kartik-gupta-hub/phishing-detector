"use client";

import { Loader2, ScanSearch, Search, ShieldCheck, Mail, Globe, Zap, Image as ImageIcon, UploadCloud } from "lucide-react";
import clsx from 'clsx';
import { motion } from "framer-motion";

interface ScanPanelProps {
  isLoading: boolean;
  scanType: 'url' | 'email' | 'screenshot';
  setScanType: (val: 'url' | 'email' | 'screenshot') => void;
  url: string;
  emailText: string;
  screenshotFile: File | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUrlChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onScreenshotChange: (file: File | null) => void;
}

const trustSignals = [
  "Live heuristics",
  "Model-backed Explainability",
  "Threat intelligence matching"
];

export default function ScanPanel({
  isLoading,
  scanType,
  setScanType,
  url,
  emailText,
  onSubmit,
  onUrlChange,
  onEmailChange,
  onScreenshotChange,
  screenshotFile,
}: ScanPanelProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onScreenshotChange(e.dataTransfer.files[0]);
    }
  };
  return (
    <section className="glass-panel relative overflow-hidden rounded-[32px] p-6 shadow-2xl sm:p-8">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end z-10 relative">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <ShieldCheck className="h-4 w-4" />
            Security Scan Console
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-display font-medium tracking-tight text-white sm:text-4xl text-shadow-glow">
              Inspect Targets for Phishing Risk
            </h2>
            <p className="max-w-2xl text-sm font-sans leading-7 text-slate-300 sm:text-base">
              Submit a target to inspect domain signals, unstructured text behavior,
              and AI-backed risk indicators to prevent cyber threats.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {trustSignals.map((signal) => (
            <div
              key={signal}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 text-sm text-slate-200 transition-all hover:bg-white/10 hover:border-cyan-400/30"
            >
              {signal}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 mb-4 flex space-x-2 bg-navy-900/60 p-1.5 w-max rounded-full border border-white/10 relative z-10">
        <button 
          type="button"
          onClick={() => setScanType('url')}
          className={clsx("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300", scanType === 'url' ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-cyan-400/30" : "text-slate-400 hover:text-white border border-transparent")}
        >
          <Globe className="w-4 h-4" />
          URL Scanner
        </button>
        <button 
          type="button"
          onClick={() => setScanType('email')}
          className={clsx("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300", scanType === 'email' ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-cyan-400/30" : "text-slate-400 hover:text-white border border-transparent")}
        >
          <Mail className="w-4 h-4" />
          Email Analyzer
        </button>
        <button 
          type="button"
          onClick={() => setScanType('screenshot')}
          className={clsx("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300", scanType === 'screenshot' ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-cyan-400/30" : "text-slate-400 hover:text-white border border-transparent")}
        >
          <ImageIcon className="w-4 h-4" />
          Visual AI
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 relative z-10 p-2 overflow-hidden rounded-3xl">
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none rounded-3xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-cyan-900/10 backdrop-blur-[2px]" />
            <div className="absolute top-0 w-full h-[6px] bg-cyan-400 shadow-[0_0_20px_4px_rgba(6,182,212,0.8)] animate-sweep" />
            <div className="absolute top-0 left-0 w-full h-full bg-scanner-sweep animate-sweep opacity-50" />
            <div className="absolute inset-0 border-2 border-cyan-400 border-opacity-50 blur-sm rounded-3xl animate-pulse" />
          </motion.div>
        )}
        
        <label className="block space-y-2">
          {scanType === 'url' ? (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="group relative"
            >
              <Search className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-400" />
              <input
                type="text"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                disabled={isLoading}
                className="w-full rounded-2xl border border-white/10 bg-navy-900/50 backdrop-blur-xl py-6 pl-16 pr-6 text-lg text-white font-sans outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:bg-navy-900/80 focus:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-cyan-400/50 disabled:opacity-50"
                placeholder="https://example.com/login"
                value={url}
                onChange={(event) => onUrlChange(event.target.value)}
              />
            </motion.div>
          ) : scanType === 'email' ? (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="group relative"
            >
              <textarea
                disabled={isLoading}
                className="w-full h-40 rounded-2xl border border-white/10 bg-navy-900/50 backdrop-blur-xl p-6 text-lg font-sans text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:bg-navy-900/80 focus:shadow-[0_0_30px_rgba(6,182,212,0.25)] resize-none hover:border-cyan-400/50 disabled:opacity-50"
                value={emailText}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="Paste the suspicious email contents here..."
              />
            </motion.div>
          ) : (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="group relative"
            >
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={clsx(
                  "flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed transition-all duration-300",
                  screenshotFile ? "border-cyan-400 bg-cyan-900/20" : "border-white/10 bg-navy-900/50 hover:border-cyan-400/50 hover:bg-navy-900/80"
                )}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="screenshot-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      onScreenshotChange(e.target.files[0]);
                    }
                  }}
                  disabled={isLoading}
                />
                <label htmlFor="screenshot-upload" className="flex flex-col items-center cursor-pointer p-6 w-full h-full justify-center">
                  {screenshotFile ? (
                    <>
                      <ImageIcon className="w-8 h-8 text-cyan-400 mb-2" />
                      <span className="text-white font-medium">{screenshotFile.name}</span>
                      <span className="text-xs text-slate-400 mt-1">Click to replace</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-slate-300 font-medium">Drag & drop a screenshot</span>
                      <span className="text-xs text-slate-500 mt-1">or click to browse (PNG, JPG)</span>
                    </>
                  )}
                </label>
              </div>
            </motion.div>
          )}
        </label>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between px-2">
          <div className="inline-flex items-center gap-2 text-sm text-slate-400">
            <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>Encrypted transmission. AI processing enabled.</span>
          </div>
          <button
            type="submit"
            disabled={isLoading || (scanType === 'url' ? !url.trim() : scanType === 'email' ? !emailText.trim() : !screenshotFile)}
            className="group relative inline-flex min-h-[60px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple px-10 text-base font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0 duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2 text-white tracking-wide">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  INITIATING SCAN...
                </>
              ) : (
                <>
                  <ScanSearch className="h-5 w-5" />
                  START SCAN
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}
