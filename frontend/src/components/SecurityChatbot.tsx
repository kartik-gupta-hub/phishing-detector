"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { chatWithSecurityAI } from "@/services/api";

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export default function SecurityChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Hello! I am PhishGuard AI. How can I assist you with cybersecurity today?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await chatWithSecurityAI(userMsg, messages);
      setMessages(prev => [...prev, { role: 'ai', text: response.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am currently experiencing network issues.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedPrompts = [
    "Explain phishing attacks",
    "How to spot a fake URL?",
    "What is typosquatting?"
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-navy-900/95 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white flex items-center gap-2">
                    PhishGuard AI
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  </h3>
                  <p className="text-xs text-slate-400">Security Analyst</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white relative z-10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600/30 text-white border border-cyan-500/30 rounded-tr-sm' 
                      : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-white/5 border border-white/10 p-3 rounded-tl-sm">
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length < 3 && !isTyping && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="flex-shrink-0 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-300 transition-colors hover:bg-purple-500/20"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-white/10 bg-navy-800 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a security question..."
                  className="w-full rounded-full border border-white/10 bg-navy-900 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 transition-colors hover:bg-cyan-500/40 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
