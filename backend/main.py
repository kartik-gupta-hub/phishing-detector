import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from db.database import engine, Base, get_db
from db import models
from ml.features import extract_all_features
from ml.model import load_model

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Phishing API")

# Setup CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class PredictionRequest(BaseModel):
    url: str
    user_id: int | None = None

class PredictionResponse(BaseModel):
    url: str
    risk_score: float
    classification: str
    features: dict
    explanation: str

# Load model ONCE at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml", "model.joblib")
clf = load_model(MODEL_PATH)

def generate_explanation(features: dict, score: float) -> str:
    # A simple deterministic rule-based AI explainer
    if score < 20:
        return "This URL looks safe. We didn't detect any unusually long strings, suspicious iframes, or obfuscated elements typically found in phishing sites."
    
    reasons = []
    if features.get("is_https") == 0:
        reasons.append("It does not use a secure HTTPS connection.")
    if features.get("has_dash") == 1:
        reasons.append("The domain contains dashes ('-'), which is common in deceptive phishing domains.")
    if features.get("num_subdomains", 0) > 3:
        reasons.append("There are an excessive number of subdomains.")
    if features.get("hidden_elements") == 1:
        reasons.append("The webpage code contains hidden elements designed to trick security scanners.")
    if features.get("has_iframe") == 1:
        reasons.append("It uses iframes which can be used to overlay fake login forms on top of legitimate sites.")
    if features.get("empty_form_actions") == 1:
        reasons.append("There are forms that submit data to suspicious or missing destinations.")
        
    explanation = f"We detected a {score:.0f}% risk. "
    if reasons:
        explanation += "Here is why: " + " ".join(reasons)
    else:
        explanation += "The combination of the URL structure and the webpage behavior matched patterns in our phishing database."
        
    return explanation

@app.get("/")
def read_root():
    return {"status": "Phishing API is running."}

@app.post("/api/predict", response_model=PredictionResponse)
def predict_phishing(req: PredictionRequest, db: Session = Depends(get_db)):
    # 1. Feature Extraction
    feature_vector, raw_features = extract_all_features(req.url)
    
    # 2. Prediction
    # clf.predict_proba returns [[P(safe), P(phish)]]
    probabilities = clf.predict_proba([feature_vector])[0]
    phish_prob = sum(probabilities[1:]) if len(probabilities) > 1 else 0.0 # binary class 1 is phish
    risk_score = round(phish_prob * 100, 2)
    
    # 3. Categorization
    if risk_score > 75:
        classification = "PHISHING"
    elif risk_score > 40:
        classification = "SUSPICIOUS"
    else:
        classification = "SAFE"
        
    # 4. Synthesize AI Explanation
    explanation = generate_explanation(raw_features, risk_score)
    
    # 5. Save to history if logged in (for now we assume valid user_id if passed)
    if req.user_id:
        new_search = models.SearchHistory(
            user_id=req.user_id,
            url=req.url,
            risk_score=risk_score,
            classification=classification
        )
        db.add(new_search)
        db.commit()

    return PredictionResponse(
        url=req.url,
        risk_score=risk_score,
        classification=classification,
        features=raw_features,
        explanation=explanation
    )
