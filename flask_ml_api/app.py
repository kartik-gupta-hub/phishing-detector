from flask import Flask, request, jsonify
from flask_cors import CORS
from ml.features import extract_url_parts, analyze_url_rules, extract_url_ml_features, analyze_email_rules, extract_email_ml_features
from ml.model import predict_hybrid
import traceback

app = Flask(__name__)
CORS(app) # Allow cross-origin for Node.js or local dev

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Flask ML API is running!"}), 200

@app.route('/api/predict/url', methods=['POST'])
def predict_url_endpoint():
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({"error": "Missing 'url' in request body"}), 400
            
        url = data['url'].strip()
        if not url:
            return jsonify({"error": "URL cannot be empty"}), 400
            
        # 1. Visualize parts
        url_parts = extract_url_parts(url)
        
        # 2. Extract ML features
        ml_features = extract_url_ml_features(url)
        
        # 3. Apply Rules
        rule_penalty, rule_reasons = analyze_url_rules(url, url_parts)
        
        # 4. Predict
        prediction, confidence, risk_score = predict_hybrid(ml_features, rule_penalty, rule_reasons)
        
        if not rule_reasons and prediction == "SAFE":
            rule_reasons.append("URL appears clean and follows standard structures.")
            
        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "risk_score": risk_score,
            "reasons": rule_reasons,
            "url_parts": url_parts
        }), 200

    except Exception as e:
        print(f"Error processing URL: {traceback.format_exc()}")
        return jsonify({"error": "Internal server error during URL analysis"}), 500

@app.route('/api/predict/email', methods=['POST'])
def predict_email_endpoint():
    try:
        data = request.get_json()
        if not data or 'email_text' not in data:
            return jsonify({"error": "Missing 'email_text' in request body"}), 400
            
        email_text = data['email_text'].strip()
        if not email_text:
            return jsonify({"error": "Email text cannot be empty"}), 400
            
        # 1. Apply rules to text
        rule_penalty, rule_reasons, embedded_links = analyze_email_rules(email_text)
        
        # 2. ML mapping (using struct mapping for MVP)
        ml_features = extract_email_ml_features(email_text)
        
        # 3. Predict Hybrid
        prediction, confidence, risk_score = predict_hybrid(ml_features, rule_penalty, rule_reasons)
        
        if not rule_reasons and prediction == "SAFE":
            rule_reasons.append("Email text does not contain common threat signatures or urgency keywords.")
            
        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "risk_score": risk_score,
            "reasons": rule_reasons,
            "embedded_links": embedded_links
        }), 200

    except Exception as e:
        print(f"Error processing Email: {traceback.format_exc()}")
        return jsonify({"error": "Internal server error during Email analysis"}), 500

if __name__ == '__main__':
    # Run locally on 8000
    app.run(host='0.0.0.0', port=8000, debug=True)
