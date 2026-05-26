"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Shield, ShieldCheck, UserCheck, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function UserRiskProfile() {
  // Mock user risk data
  const securityScore = 85;
  const riskLevel = "Low Risk";
  const recentScans = 12;
  const phishingExposures = 1;

  const data = [
    { name: "Safe", value: securityScore },
    { name: "Risk", value: 100 - securityScore },
  ];
  const COLORS = ["#10b981", "rgba(255,255,255,0.05)"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel relative overflow-hidden rounded-[32px] border border-white/10 p-6 sm:p-8 mt-12 mb-8"
    >
      <div className="absolute top-0 right-0 h-64 w-64 bg-cyan-500/10 blur-[100px] rounded-full" />
      
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        
        {/* Score Gauge */}
        <div className="w-48 h-48 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={85}
                startAngle={225}
                endAngle={-45}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-bold text-white tracking-tighter">{securityScore}</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Score</span>
          </div>
        </div>

        {/* User Stats */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <h3 className="text-2xl font-display font-semibold text-white flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-cyan-400" />
              User Security Profile
            </h3>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Based on your recent scanning activity and interactions, your digital footprint is currently assessed as 
              <span className="text-emerald-400 font-bold ml-1">{riskLevel}</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/5 bg-navy-900/50 p-4">
               <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Recent Scans</div>
               <div className="text-2xl font-bold text-white">{recentScans}</div>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-900/10 p-4">
               <div className="text-xs text-red-400 uppercase tracking-widest mb-1">Threat Exposures</div>
               <div className="text-2xl font-bold text-white">{phishingExposures}</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="flex-1 w-full rounded-3xl border border-white/5 bg-[#0a0a0f] p-6 self-stretch flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-500 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              AI Recommendations
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                Consider enabling 2FA on the Microsoft account associated with your last scan.
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                Your email exposure is low. Continue using the Email Analyzer for unknown senders.
              </li>
            </ul>
          </div>
          <button className="mt-6 w-full rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 text-sm transition-colors">
            View Full Report
          </button>
        </div>

      </div>
    </motion.div>
  );
}
