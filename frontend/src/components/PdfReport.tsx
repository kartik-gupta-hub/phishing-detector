"use client";

import type { PredictionResult } from "@/types/prediction";

interface PdfReportProps {
  result: PredictionResult;
}

function getRiskSummary(score: number, type: "url" | "email") {
  if (score > 75) {
    return {
      tone: "High risk",
      accent: "#dc2626",
      summary:
        "Multiple strong phishing indicators were detected. Treat this target as unsafe until verified through a trusted channel.",
    };
  }

  if (score >= 40) {
    return {
      tone: "Needs review",
      accent: "#ea580c",
      summary:
        "The detector found several suspicious signals that justify manual validation before interacting with the target.",
    };
  }

  return {
    tone: "Low risk",
    accent: "#059669",
    summary:
      type === "url"
        ? "Only limited phishing indicators were detected in the inspected URL structure."
        : "Only limited phishing indicators were detected in the submitted email content.",
  };
}

function formatReasons(reasons: string[]) {
  return reasons.length > 0
    ? reasons
    : ["No significant phishing signals were returned by the analysis pipeline."];
}

export default function PdfReport({ result }: PdfReportProps) {
  const type = result.type ?? "url";
  const targetLabel = type === "url" ? "Target URL" : "Target Email";
  const risk = getRiskSummary(result.risk_score, type);
  const reasons = formatReasons(result.reasons);
  const generatedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article className="pdf-report">
      <header className="pdf-section pdf-hero">
        <div>
          <p className="pdf-kicker">Enterprise Phishing Detection Report</p>
          <h1>Hybrid Threat Assessment</h1>
          <p className="pdf-subtle">
            A print-safe report generated from the latest phishing scan.
          </p>
        </div>
        <div className="pdf-meta-grid">
          <div className="pdf-meta-card">
            <span className="pdf-label">Generated</span>
            <strong>{generatedAt}</strong>
          </div>
          <div className="pdf-meta-card">
            <span className="pdf-label">Scan type</span>
            <strong>{type === "url" ? "URL analysis" : "Email analysis"}</strong>
          </div>
          <div className="pdf-meta-card">
            <span className="pdf-label">Verdict</span>
            <strong>{result.prediction}</strong>
          </div>
        </div>
      </header>

      <section className="pdf-section pdf-risk-grid">
        <div className="pdf-score-card">
          <span className="pdf-label">Threat score</span>
          <div className="pdf-score-value" style={{ color: risk.accent }}>
            {result.risk_score.toFixed(0)}%
          </div>
          <p className="pdf-subtle">Model confidence: {result.confidence.toFixed(1)}%</p>
          <div className="pdf-score-bar" aria-hidden="true">
            <div
              className="pdf-score-bar-fill"
              style={{
                width: `${Math.max(6, Math.min(100, result.risk_score))}%`,
                backgroundColor: risk.accent,
              }}
            />
          </div>
        </div>

        <div className="pdf-summary-card">
          <span className="pdf-label">Risk posture</span>
          <h2 style={{ color: risk.accent }}>{risk.tone}</h2>
          <p>{risk.summary}</p>
          <div className="pdf-pill-row">
            <span className="pdf-pill">Verdict: {result.prediction}</span>
            <span className="pdf-pill">Confidence: {result.confidence.toFixed(1)}%</span>
          </div>
        </div>
      </section>

      <section className="pdf-section">
        <span className="pdf-label">{targetLabel}</span>
        <div className="pdf-target-block">{result.targetScanned ?? "No target captured."}</div>
      </section>

      {type === "url" && result.url_parts ? (
        <section className="pdf-section">
          <span className="pdf-label">URL structure</span>
          <div className="pdf-grid-two">
            <div className="pdf-detail-card">
              <strong>Protocol</strong>
              <span>{result.url_parts.protocol || "N/A"}</span>
            </div>
            <div className="pdf-detail-card">
              <strong>Domain</strong>
              <span>
                {result.url_parts.domain}.{result.url_parts.tld}
              </span>
            </div>
            <div className="pdf-detail-card">
              <strong>Subdomain</strong>
              <span>{result.url_parts.subdomain || "None"}</span>
            </div>
            <div className="pdf-detail-card">
              <strong>Path</strong>
              <span>{result.url_parts.path || "/"}</span>
            </div>
          </div>
        </section>
      ) : null}

      {type === "email" && result.embedded_links?.length ? (
        <section className="pdf-section">
          <span className="pdf-label">Embedded links</span>
          <div className="pdf-stack">
            {result.embedded_links.map((link) => (
              <div key={link} className="pdf-detail-card">
                <span>{link}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="pdf-section">
        <span className="pdf-label">AI analysis</span>
        <div className="pdf-stack">
          {reasons.map((reason, index) => (
            <div key={`${reason}-${index}`} className="pdf-reason-card">
              <strong>Signal {index + 1}</strong>
              <p>{reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pdf-section">
        <span className="pdf-label">Analyst verdict</span>
        <div className="pdf-summary-card">
          <h2>Recommended next step</h2>
          <p>
            {result.risk_score >= 40
              ? "Avoid engaging with the target until the sender, domain, or destination can be validated independently."
              : "Risk appears limited, but continue normal verification practices before trusting sensitive actions."}
          </p>
        </div>
      </section>
    </article>
  );
}
