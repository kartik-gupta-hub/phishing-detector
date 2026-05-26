"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

interface RiskMeterProps {
  score: number;
  confidence: number;
  prediction?: string;
  targetScanned?: string;
  type?: 'url' | 'email' | 'screenshot';
}

export default function RiskMeter({
  score,
  confidence,
  prediction,
  targetScanned,
  type = 'url',
}: RiskMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1500;
    const incrementTime = 30;
    const steps = duration / incrementTime;
    const stepValue = end / steps;

    if (end === 0) return;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        clearInterval(timer);
        setDisplayScore(end);
      } else {
        setDisplayScore(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  let color = "#10b981"; // Green
  let label = prediction || "Safe";
  let bgGradient = "from-emerald-900/40 to-emerald-900/10 border-emerald-500/20";
  let summary =
    type === 'url' ? "Low immediate phishing signals detected across the inspected URL and page behavior." : 
    type === 'email' ? "No immediate phishing signals detected in the email text." :
    "No immediate visual phishing indicators detected in the screenshot.";
  let Icon = CheckCircle2;

  if (score > 75) {
    color = "#ef4444"; // Red
    label = prediction || "Phishing";
    bgGradient = "from-red-900/40 to-red-900/10 border-red-500/20";
    summary =
      "This destination matches several high-risk phishing patterns and should be treated as unsafe.";
    Icon = ShieldAlert;
  } else if (score >= 40) {
    color = "#f97316"; // Orange
    label = prediction || "Suspicious";
    bgGradient = "from-orange-900/40 to-orange-900/10 border-orange-500/20";
    summary =
      "The scan found a meaningful number of suspicious indicators that warrant manual review.";
    Icon = AlertTriangle;
  }

  // Calculate arc parameters
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference / 2;
  const strokeDashoffset = arcLength - (score / 100) * arcLength;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, rotateX: 10 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      className={`relative overflow-hidden rounded-[32px] glass-panel border bg-gradient-to-b ${bgGradient} p-8 hover-trigger group`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="absolute left-1/2 top-[45%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-40 transition-all duration-700 ease-in-out group-hover:opacity-70 group-hover:scale-110"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Risk posture
          </p>
          <h3 className="mt-2 text-3xl font-display font-medium text-white tracking-tight">Threat score</h3>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] shadow-lg backdrop-blur-md"
          style={{
            backgroundColor: `${color}20`,
            color,
            borderColor: `${color}40`,
            boxShadow: `0 0 20px ${color}20`
          }}
        >
          <Icon className="h-5 w-5" />
          {label}
        </motion.div>
      </div>
      
      <div className="relative mt-10 flex h-44 justify-center overflow-hidden">
        <svg
          className="absolute bottom-0 h-[280px] w-[280px] rotate-180 transform"
          viewBox="0 0 260 260"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="20"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          <motion.circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="20"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        <div className="z-10 flex flex-col items-center justify-end pb-4">
          <motion.div 
            className="text-7xl font-bold font-display tracking-tighter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ color, textShadow: `0 0 30px ${color}80` }}
          >
            {Math.round(displayScore)}%
          </motion.div>
          <motion.span 
            className="mt-1 text-sm font-medium tracking-wide text-slate-400 uppercase rounded-full bg-navy-900/50 border border-white/5 py-1 px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Model confidence: <strong style={{ color }}>{confidence.toFixed(1)}%</strong>
          </motion.span>
        </div>
      </div>
      
      <motion.div 
        className="relative z-10 mt-8 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-base leading-relaxed text-slate-300 bg-navy-900/30 p-4 rounded-2xl border border-white/5">{summary}</p>
        {targetScanned ? (
          <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-4 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }}/>
              {type === 'url' ? 'Target URL' : type === 'email' ? 'Target Email' : 'Uploaded Screenshot'}
            </p>
            <p className="mt-3 text-sm text-slate-200 font-mono tracking-tight" style={{ wordBreak: 'break-all', whiteSpace: type === 'email' ? 'pre-wrap' : 'normal' }}>
                {type === 'email' && targetScanned.length > 300 ? targetScanned.substring(0, 300) + '...' : targetScanned}
            </p>
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
