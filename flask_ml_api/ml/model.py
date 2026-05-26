import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def generate_synthetic_data(num_samples=1000):
    X = []
    y = []
    
    for _ in range(num_samples):
        is_phishing = np.random.choice([0, 1])
        
        if is_phishing:
            url_length = np.random.uniform(50, 150)
            has_at_symbol = np.random.choice([0, 1], p=[0.8, 0.2])
            has_dash = np.random.choice([0, 1], p=[0.3, 0.7])
            is_https = np.random.choice([0, 1], p=[0.6, 0.4])
            num_subdomains = np.random.uniform(2, 6)
            has_ip = np.random.choice([0, 1], p=[0.9, 0.1])
        else:
            url_length = np.random.uniform(20, 80)
            has_at_symbol = 0
            has_dash = np.random.choice([0, 1], p=[0.8, 0.2])
            is_https = 1
            num_subdomains = np.random.uniform(1, 3)
            has_ip = 0
            
        x_row = [
            url_length, has_at_symbol, has_dash, is_https, num_subdomains, has_ip
        ]
        X.append(x_row)
        y.append(is_phishing)
        
    return np.array(X), np.array(y)

def train_and_save_model(model_path="ml/model.joblib"):
    print("Generating synthetic data for the ML component...")
    X, y = generate_synthetic_data(2000)
    
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X, y)
    
    dirname = os.path.dirname(model_path)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    joblib.dump(clf, model_path)
    return clf
    
def load_model(model_path="ml/model.joblib"):
    if not os.path.exists(model_path):
        return train_and_save_model(model_path)
    return joblib.load(model_path)

# Initialize model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")
clf = load_model(MODEL_PATH)

def predict_hybrid(ml_features: dict, rule_penalty: int, rule_reasons: list):
    """
    Combines rule-based penalty (0-100) and ML model output to generate:
    - prediction (SAFE/SUSPICIOUS/PHISHING)
    - risk_score (0-100) indicating severity
    - confidence (0-100) indicating model certainty
    """
    feature_keys = ["url_length", "has_at_symbol", "has_dash", "is_https", "num_subdomains", "has_ip"]
    feature_vector = [[ml_features[k] for k in feature_keys]]
    
    # ML probabilities: [[P(Safe), P(Phishing)]]
    probs = clf.predict_proba(feature_vector)[0]
    ml_phish_prob = probs[1] * 100
    
    # Confidence is determined by how far the ML probability is from the 50% boundary, or how strong the rules are
    # Max confidence if prob is 0% or 100%, min if 50%
    ml_confidence = abs((ml_phish_prob - 50) / 50) * 100
    
    # Hybrid Risk Score: Weighted average of ML prediction (40%) and Rules (60%)
    hybrid_risk_score = (ml_phish_prob * 0.4) + (rule_penalty * 0.6)
    
    # Add strong overrides: If IP detected in rules, risk must be high
    if any("IP address" in r for r in rule_reasons):
        hybrid_risk_score = max(hybrid_risk_score, 85)
        ml_confidence = max(ml_confidence, 95)
        
    hybrid_risk_score = min(round(hybrid_risk_score, 2), 100.0)
    final_confidence = min(round(ml_confidence, 2), 100.0)
    
    if hybrid_risk_score > 75:
        prediction = "PHISHING"
    elif hybrid_risk_score >= 40:
        prediction = "SUSPICIOUS"
    else:
        prediction = "SAFE"
        
    return prediction, final_confidence, hybrid_risk_score
