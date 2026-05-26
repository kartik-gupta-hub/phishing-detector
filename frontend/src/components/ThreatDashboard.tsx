"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, ShieldCheck, Activity, Terminal, Globe2 } from "lucide-react";
import { getDashboardStats, getScanHistory } from "@/services/api";
import { motion, Variants, AnimatePresence } from "framer-motion";

interface Stats {
  total: number;
  phishing: number;
  safe: number;
}

interface ScanHistoryEntry {
  id: number;
  risk_score: number;
}

export default function ThreatDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, phishing: 0, safe: 0 });
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const fetchStats = async () => {
        try {
            const resStats = await getDashboardStats();
            const resHistory = await getScanHistory();
            
            setStats(resStats);
            setHistory(resHistory.history);
        } catch {
            setStats({ total: 1240, phishing: 342, safe: 898 });
            const dummyHistory = Array.from({length: 10}).map((_, i) => ({
                id: i,
                timestamp: new Date(Date.now() - (10 - i) * 86400000).toISOString(),
                risk_score: Math.floor(Math.random() * 100),
                prediction: Math.random() > 0.3 ? 'SAFE' : 'PHISHING'
            }));
            setHistory(dummyHistory);
        }
    };
    fetchStats();

    // Simulate live terminal logs
    const mockLogs = [
      "Detected anomaly in ASN 45090...",
      "Analyzing suspicious redirect chain from bit.ly/3x89...",
      "Blocked unauthorized access attempt from IP 192.168.1.55...",
      "Heuristic engine updated with latest signatures.",
      "Scanned 45 emails in background processing...",
      "Warning: High volume of phishing detected originating from .xyz domains."
    ];
    let logIndex = 0;
    const interval = setInterval(() => {
      setLiveLogs(prev => {
        const nextLogs = [...prev, `[${new Date().toISOString().split('T')[1].split('.')[0]}] ${mockLogs[logIndex % mockLogs.length]}`];
        return nextLogs.slice(-5);
      });
      logIndex++;
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const chartData = history.slice(0, 15).reverse().map((scan, i) => ({
      name: `Scan ${i + 1}`,
      risk: scan.risk_score
  }));

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="glass-panel hover-trigger rounded-[32px] border border-white/10 p-6 sm:p-10 mt-16"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-10">
        <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-400/80">
            Global Analytics
          </p>
          <h3 className="mt-1 text-3xl font-display font-semibold text-white tracking-tight">
            Threat Intelligence
          </h3>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div variants={itemVariants} className="group rounded-3xl border border-white/10 bg-navy-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:-translate-y-1 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Activity className="w-24 h-24" />
            </div>
            <div className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Total Scans</div>
            <div className="text-5xl font-display font-bold text-white tracking-tighter">{stats.total.toLocaleString()}</div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="group rounded-3xl border border-emerald-500/20 bg-emerald-900/20 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-400">
               <ShieldCheck className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-3">
                <ShieldCheck className="h-4 w-4" />
                Safe Traffic
            </div>
            <div className="text-5xl font-display font-bold text-white tracking-tighter">{stats.safe.toLocaleString()}</div>
        </motion.div>

        <motion.div variants={itemVariants} className="group rounded-3xl border border-red-500/20 bg-red-900/20 p-6 backdrop-blur-xl transition-all duration-300 hover:border-red-400/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:-translate-y-1 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-red-500">
               <ShieldAlert className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-red-400 mb-3">
                <ShieldAlert className="h-4 w-4" />
                Phishing Blocked
            </div>
            <div className="text-5xl font-display font-bold text-white tracking-tighter">{stats.phishing.toLocaleString()}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div variants={itemVariants} className="h-80 w-full bg-navy-900/30 rounded-3xl p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05),transparent_70%)]" />
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2 relative z-10">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Live Risk Trends
          </h4>
          {hasMounted ? (
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(5,11,20,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#c4b5fd', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="risk" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} activeDot={{ r: 6, fill: '#c4b5fd', stroke: '#8b5cf6', strokeWidth: 2 }} />
                </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </motion.div>

        <motion.div variants={itemVariants} className="h-80 w-full bg-[#0a0a0f] rounded-3xl p-6 border border-white/10 relative overflow-hidden font-mono text-xs flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <h4 className="font-bold uppercase tracking-[0.2em] text-cyan-500 mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              SOC Terminal Feed
          </h4>
          <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-2">
            <AnimatePresence>
              {liveLogs.map((log, idx) => (
                <motion.div 
                  key={log + idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-green-400/80"
                >
                  <span className="text-cyan-500/50">{'> '}</span>
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="text-green-400/80 flex items-center gap-1">
              <span className="text-cyan-500/50">{'> '}</span>
              <span className="w-2 h-3 bg-green-400/80 animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
