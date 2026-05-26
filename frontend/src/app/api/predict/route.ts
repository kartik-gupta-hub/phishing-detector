import { NextResponse } from "next/server";
import type { PredictionErrorPayload } from "@/types/prediction";

const BACKEND_URL = process.env.PHISHING_API_URL ?? "http://127.0.0.1:8000";
const REQUEST_TIMEOUT_MS = 12000;

function jsonError(error: string, status: number, details?: string) {
  const payload: PredictionErrorPayload = { error };

  if (details) {
    payload.details = details;
  }

  return NextResponse.json(payload, { status });
}

export async function POST(request: Request) {
  let body: { url?: string };

  try {
    body = await request.json();
  } catch {
    return jsonError("We could not read the scan request.", 400);
  }

  const submittedUrl = body.url?.trim();

  if (!submittedUrl) {
    return jsonError("Enter a URL to start the phishing scan.", 400);
  }

  try {
    new URL(submittedUrl);
  } catch {
    return jsonError("Enter a valid URL, including the domain name.", 400);
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: submittedUrl }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return jsonError(
        data?.detail || data?.error || "The scan service returned an error.",
        response.status,
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return jsonError(
        "The scan is taking longer than expected.",
        504,
        "The phishing engine did not respond in time. Please try again in a moment.",
      );
    }

    return jsonError(
      "We could not reach the phishing analysis service.",
      503,
      "Make sure the backend API is running on port 8000 or set PHISHING_API_URL in the frontend environment.",
    );
  }
}
