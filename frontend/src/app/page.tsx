"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  Sparkles,
  Download,
  Loader2,
} from "lucide-react";
import ExplanationAI from "@/components/ExplanationAI";
import PdfReport from "@/components/PdfReport";
import RiskMeter from "@/components/RiskMeter";
import ScanPanel from "@/components/ScanPanel";
import StatePanel from "@/components/StatePanel";
import URLVisualizer from "@/components/URLVisualizer";
import ScreenshotVisualizer from "@/components/ScreenshotVisualizer";
import ThreatDashboard from "@/components/ThreatDashboard";
import UserRiskProfile from "@/components/UserRiskProfile";
import type {
  PredictionErrorPayload,
  PredictionResult,
} from "@/types/prediction";
import { generatePDFFromElement } from "@/utils/pdfGenerator";
import { scanUrl, scanEmail, scanScreenshot } from "@/services/api";
import Spline from "@splinetool/react-spline";

import HistoryTimeline from "@/components/HistoryTimeline";
import Footer from "@/components/Footer";

const platformStats = [
  {
    label: "Inspection layers",
    value: "10+",
    detail: "Signals combined from structural and situational heuristics",
  },
  {
    label: "Response mode",
    value: "Live",
    detail: "Real-time scoring and narrative explanation",
  },
  {
    label: "Designed for",
    value: "Enterprise SOC",
    detail: "Fast triage for suspicious links and scam emails",
  },
];

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";

  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;
}

export default function Home() {
  const [scanType, setScanType] = useState<'url' | 'email' | 'screenshot'>('url');
  const [url, setUrl] = useState("");
  const [emailText, setEmailText] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<PredictionErrorPayload | null>(null);
  const exportReportRef = useRef<HTMLDivElement | null>(null);

  const handleScan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    let endpoint = "/api/scans/url";
    let payload: { url?: string; email_text?: string } = {};

    if (scanType === 'url') {
        const validUrl = normalizeUrl(url);
        if (!validUrl) {
            setIsLoading(false);
            return;
        }
        setUrl(validUrl);
        payload = { url: validUrl };
    } else {
        if (!emailText.trim()) {
            setIsLoading(false);
            return;
        }
        endpoint = "/api/scans/email";
        payload = { email_text: emailText };
    }

    try {
      let data;
      if (scanType === 'url') {
          data = await scanUrl(payload.url!);
      } else if (scanType === 'email') {
          data = await scanEmail(payload.email_text!);
      } else if (scanType === 'screenshot') {
          if (!screenshotFile) {
              setIsLoading(false);
              return;
          }
          data = await scanScreenshot(screenshotFile);
      }
      
      setResult({
          ...data,
          targetScanned: scanType === 'url' ? payload.url : scanType === 'email' ? payload.email_text : 'Image Upload',
          type: scanType
      });
      
    } catch (err: any) {
      setError({
        error: "We couldn't complete the phishing scan.",
        details:
          err.response?.data?.error ||
          "A network issue interrupted the request. Ensure Node and Flask servers are running.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result || !exportReportRef.current || isGeneratingPdf) {
      return;
    }

    setIsGeneratingPdf(true);

    try {
      await generatePDFFromElement(
        exportReportRef.current,
        `Phishing_Report_${Date.now()}`,
      );
    } catch (pdfError) {
      console.error("Failed to generate phishing report PDF.", pdfError);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Animated Glow Layers */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-[10%] top-40 h-[28rem] w-[28rem] rounded-full bg-purple-600/20 blur-[150px]" 
        />
      </div>

      <div className="absolute top-0 right-0 z-0 h-[80vh] w-full max-w-[800px] opacity-40 mix-blend-screen select-none lg:opacity-70 pointer-events-auto">
        <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12">
        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center min-h-[60vh] py-10">
          <div className="space-y-8 z-10 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md"
            >
              <Shield className="h-4 w-4" />
              Next-Gen Phishing Detection
            </motion.div>

            <div className="max-w-3xl space-y-6">
              <motion.h1
                className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl !leading-[1.1] drop-shadow-lg font-display"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              >
                Detect Phishing Before It <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Strikes.</span>
              </motion.h1>
              <motion.p
                className="max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                An enterprise-grade hybrid ML platform designed to unmask malicious URLs and scam emails instantly using contextual AI verification.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1"
          >
            {platformStats.map((item) => (
              <div
                key={item.label}
                className="surface-panel rounded-[24px] border border-white/10 p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {item.label}
                </div>
                <div className="mt-3 text-2xl font-semibold text-white">
                  {item.value}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.detail}
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <ScanPanel
            isLoading={isLoading}
            scanType={scanType}
            setScanType={setScanType}
            url={url}
            emailText={emailText}
            screenshotFile={screenshotFile}
            onSubmit={handleScan}
            onUrlChange={setUrl}
            onEmailChange={setEmailText}
            onScreenshotChange={setScreenshotFile}
          />
        </motion.div>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]" id="report-container">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result-left"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="space-y-6"
              >
                <RiskMeter
                  score={result.risk_score}
                  confidence={result.confidence}
                  prediction={result.prediction}
                  targetScanned={result.targetScanned}
                  type={result.type}
                />

                {result.type === 'url' && result.url_parts && (
                    <URLVisualizer urlParts={result.url_parts} />
                )}

                {result.type === 'screenshot' && (
                    <ScreenshotVisualizer 
                      ocrText={result.ocr_text}
                      fakeLoginDetected={result.fake_login_detected}
                      brandImpersonation={result.brand_impersonation}
                    />
                )}

                <div data-html2canvas-ignore="true" className="surface-panel rounded-[28px] border border-white/10 p-6 flex justify-between items-center bg-cyan-500/[0.03]">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Export Findings</h3>
                        <p className="text-sm text-slate-400">Download a formalized PDF report of this scan.</p>
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPdf}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isGeneratingPdf ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        {isGeneratingPdf ? "Generating PDF..." : "Save PDF"}
                    </button>
                </div>

              </motion.div>
            ) : error ? (
              <motion.div
                key="error-left"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
              >
                <StatePanel
                  variant="error"
                  title={error.error}
                  description={error.details || "A server or network error occurred during analysis."}
                  details="Verify backend connectivity."
                />
              </motion.div>
            ) : isLoading ? (
              <motion.div
                key="loading-left"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
              >
                <StatePanel
                  variant="loading"
                  title={`Analyzing the submitted ${scanType === 'url' ? 'URL' : 'email text'}...`}
                  description="The system is applying heuristics and gathering model-backed risk features."
                  details="Your scan should return in a few seconds."
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty-left"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
              >
                <StatePanel
                  variant="empty"
                  title={`Submit a ${scanType === 'url' ? 'URL' : 'block of email text'} to start.`}
                  description="You'll get a hybrid risk score and an explainable breakdown."
                  details="Helpful examples: resetting passwords, banking notices, or unusual tracking links."
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result-right"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="space-y-6"
              >
                <ExplanationAI explanation={result.reasons.join('\n\n* ')} />
                
                <div className="surface-panel rounded-[28px] border border-white/10 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Diagnostics
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        AI Output Validation
                      </h3>
                    </div>
                    <Sparkles className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
                        <div className="text-3xl font-bold text-white tracking-tight">{result.confidence.toFixed(1)}%</div>
                        <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Model Confidence</div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
                        <div className="text-3xl font-bold text-white tracking-tight">{result.prediction}</div>
                        <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Hybrid Verdict</div>
                    </div>
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div
                key="support-right"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="surface-panel rounded-[28px] border border-white/10 p-6 sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-400/15 p-2.5 text-cyan-300">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Analyst notes
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-white">
                      What the scanner looks for
                    </h3>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {[
                    "Suspicious URL structure like long paths, dash-heavy domains, and deceptive subdomains.",
                    "Unsafe email semantics like urgent financial requests and common scam hooks.",
                    "Transport and redirect clues that affect trust, destination clarity, and user safety.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <UserRiskProfile />
        <ThreatDashboard />
        <HistoryTimeline />

      </div>

      <Footer />

      {result ? (
        <div className="pdf-export-shell" aria-hidden="true">
          <div ref={exportReportRef}>
            <PdfReport result={result} />
          </div>
        </div>
      ) : null}
    </main>
  );
}
