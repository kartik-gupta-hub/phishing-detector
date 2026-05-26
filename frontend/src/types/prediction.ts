export interface URLParts {
  protocol: string;
  subdomain: string;
  domain: string;
  tld: string;
  path: string;
  query: string;
}

export interface PredictionResult {
  prediction: "SAFE" | "SUSPICIOUS" | "PHISHING" | string;
  confidence: number;
  risk_score: number;
  reasons: string[];
  url_parts?: URLParts;
  embedded_links?: string[];
  targetScanned?: string; // We'll inject this on the frontend
  type?: 'url' | 'email' | 'screenshot';
  ocr_text?: string;
  fake_login_detected?: boolean;
  brand_impersonation?: string | null;
}

export interface PredictionErrorPayload {
  error: string;
  details?: string;
}
