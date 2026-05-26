"use client";

import { motion } from "framer-motion";
import { Clock, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface HistoryEntry {
  id: number;
  time: string;
  target: string;
  type: string;
  risk: number;
}

export default function HistoryTimeline() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("/api/scans/history");
        const items = (response.data.history ?? []).slice(0, 6).map(
          (
            item: {
              id: number;
              timestamp: string;
              target: string;
              type: string;
              risk_score: number;
            },
            index: number,
          ) => ({
            id: item.id ?? index,
            time: formatRelativeTime(item.timestamp),
            target: item.target,
            type: item.type,
            risk: item.risk_score,
          }),
        );

        setHistory(items);
      } catch {
        setHistory([]);
      }
    };

    fetchHistory();
  }, []);

  function formatRelativeTime(timestamp: string) {
    const date = new Date(timestamp.replace(" ", "T"));
    const diffMs = Date.now() - date.getTime();

    if (Number.isNaN(diffMs) || diffMs < 0) {
      return "Recently";
    }

    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  const getRiskIcon = (score: number) => {
    if (score > 75) return <ShieldAlert className="h-4 w-4 text-red-500" />;
    if (score > 40) return <AlertTriangle className="h-4 w-4 text-orange-400" />;
    return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
  };

  const getRiskColor = (score: number) => {
    if (score > 75) return "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]";
    if (score > 40) return "bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.8)]";
    return "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]";
  };

  return (
    <div className="relative mt-20 p-8 sm:p-12 mb-20 surface-panel rounded-[32px] border border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-10">
        <div className="rounded-2xl bg-cyan-400/15 p-2.5 text-cyan-300">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Activity Log
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-white">
            Recent Scans Timeline
          </h3>
        </div>
      </div>

      <div className="relative pl-6 sm:pl-10 space-y-8">
        <div className="absolute left-[13px] sm:left-[21px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent opacity-30" />
        
        {history.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
            className="relative group pr-4"
          >
            <div className={`absolute -left-[30px] sm:-left-[38px] top-6 w-3 h-3 rounded-full ${getRiskColor(item.risk)} animate-pulse`} />
            
            <div className="glass-panel p-5 rounded-2xl border border-white/5 transition-all duration-300 hover:bg-navy-900/60 hover:border-cyan-400/30 flex items-center justify-between hover-trigger">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     {getRiskIcon(item.risk)}
                     <span className="text-xs font-mono text-slate-400 tracking-widest">{item.time}</span>
                  </div>
                  <h4 className="text-base text-slate-200 font-medium font-sans truncate max-w-[200px] sm:max-w-md">{item.target}</h4>
               </div>
               <div className="text-2xl font-display font-bold" style={{ color: item.risk > 75 ? '#ef4444' : item.risk > 40 ? '#fb923c' : '#34d399' }}>
                   {item.risk}%
               </div>
            </div>
          </motion.div>
        ))}

        {history.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-sm text-slate-400">
            Recent scan activity will appear here after the first successful request.
          </div>
        ) : null}
      </div>
    </div>
  );
}
