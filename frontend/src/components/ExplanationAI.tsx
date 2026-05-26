"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface ExplanationAIProps {
  explanation: string;
}

export default function ExplanationAI({ explanation }: ExplanationAIProps) {
  // Try to parse the bullet points
  const points = explanation.split('* ').filter(p => p.trim() !== '');

  const getIconForText = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('suspicious') || lower.includes('warning') || lower.includes('phishing')) return <AlertTriangle className="h-4 w-4 text-orange-400" />;
    if (lower.includes('safe') || lower.includes('legitimate')) return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    return <Info className="h-4 w-4 text-cyan-400" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.8 }}
      className="glass-panel relative mt-8 overflow-hidden rounded-[32px] border border-white/10 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_40%)]" />
      
      <div className="relative mb-6 flex items-center gap-4">
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl bg-purple-500/15 p-3 text-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
        >
          <Bot className="h-6 w-6" />
        </motion.div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-400/80">
            Narrative Analysis
          </p>
          <h3 className="mt-1 flex items-center gap-2 text-2xl font-display font-semibold text-white tracking-tight">
            AI Explanations <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
          </h3>
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="relative grid gap-3"
      >
        {points.length > 0 ? points.map((point, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className="group relative rounded-2xl border border-white/5 bg-navy-900/60 p-4 transition-all duration-300 hover:bg-navy-900/80 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:pl-6"
          >
            <div className="flex items-start gap-4">
               <div className="mt-1 rounded-full bg-navy-800 p-2 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/20 transition-colors">
                 {getIconForText(point)}
               </div>
               <p className="text-sm leading-relaxed text-slate-300 font-sans">
                 {point.trim()}
               </p>
            </div>
          </motion.div>
        )) : (
          <p className="text-sm leading-7 text-slate-300 whitespace-pre-wrap">{explanation}</p>
        )}
      </motion.div>
    </motion.div>
  );
}
