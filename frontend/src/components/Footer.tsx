export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-navy-950/80 backdrop-blur-2xl px-5 py-12 sm:px-8 lg:px-12 w-full z-10">
       <div className="absolute inset-x-0 -top-[1px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
       
       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
             <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                PhishGuard <span className="text-cyan-400">AI</span>
             </h2>
             <p className="text-sm font-sans text-slate-400">
                Detect Phishing Before It Strikes. Enterprise-grade AI analysis.
             </p>
          </div>
          
          <div className="flex gap-6">
             <a href="#" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">Documentation</a>
             <a href="#" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">API Access</a>
             <a href="#" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</a>
          </div>
       </div>
       
       <div className="mt-12 text-center text-xs text-slate-500">
         &copy; {new Date().getFullYear()} PhishGuard AI Systems. All rights reserved.
       </div>
    </footer>
  );
}
