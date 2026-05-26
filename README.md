<<<<<<< HEAD
# Phishing Detector

An AI-powered phishing detection system that analyzes URLs, emails, and website features to identify potential phishing attacks.

## Features
- URL phishing detection
- Machine learning based analysis
- Suspicious domain detection
- Real-time prediction
- User-friendly interface

## Tech Stack
- Python
- Flask
- Scikit-learn
- HTML/CSS/JavaScript

## Installation
```bash
pip install -r requirements.txt
python app.py
=======
# Enterprise Phishing Detection System

A highly advanced, production-ready, full-stack cybersecurity application designed to detect and dissect phishing threats leveraging a hybrid approach of Explainable Machine Learning (AI) and Deterministic Heuristics.

This project encompasses a resilient Microservices Architecture suitable for scaling in production.

## 🚀 Key Features
* **Hybrid Core Detection Engine (Explainable AI)**: Uses an ML model (`Scikit-Learn Random Forest`) augmented with rule-based heuristics to provide highly accurate detection scores alongside a human-readable explanation of the calculated threat vectors.
* **Dual Targeting System**: Capable of ingesting both **Suspicious URLs** and **Scam Email Text** individually, applying targeted parsing heuristics for each input type.
* **Threat Intelligence Dashboard**: An automatic data-visualization suite built in `Recharts` rendering historical live scans, Safe vs Phishing traffic volumes, and a real-time Risk Area chart.
* **Advanced "Antigravity Analytics" UI**: A dark, glowing interface crafted with `Next.js 14`, `Tailwind CSS v3.4`, and `Framer Motion` demonstrating modern, premium UX flow.
* **Auto-PDF Reporting Engine**: Allow analysts to instantly click and download PDF snapshots of the scan state to supply for Incident Response.

## 🏗 Modular Tech Architecture
1. **Frontend Application**: `Next.js` (React), `Tailwind CSS`, `Framer Motion`, `Recharts`
2. **Backend Gateway Proxy**: `Node.js`, `Express.js`, `SQLite` (History Tracking)
3. **Machine Learning API**: `Python 3`, `Flask`, `Scikit-Learn`, `BeautifulSoup`

## 💻 Local Development Setup

To run this complete stack locally, you need three separate terminal windows.

### 1. Start the Machine Learning API (Port: 8000)
This Python microservice handles the Random Forest and Explainability parsing.
```bash
cd flask_ml_api

# Install dependencies (use a virtual env for best practices)
pip install -r requirements.txt

# Start the Flask API
python app.py
```

### 2. Start the Node.js API Gateway (Port: 5000)
This acts as the backend orchestrator and database pipeline.
```bash
cd node_backend

# Install node dependencies
npm install

# Start the backend server
npm start
```

### 3. Start the Next.js Frontend Dashboard (Port: 3000)
```bash
cd frontend

# Install UI dependencies
npm install

# Start the interactive UI
npm run dev
```
Access the application securely via `http://localhost:3000`.

## 🌐 Production Deployment Steps

1. **Frontend ➔ Vercel**
   - Push the repo to GitHub.
   - Import the project into Vercel. Edit the Root Directory to `frontend`.
   - Vercel will automatically build the Next.js application.

2. **Backend ➔ Render / Heroku**
   - Import the project into Render targeting the `node_backend` directory.
   - Set start command to `npm start`.
   - (Consider changing SQLite to PostgreSQL on Render for ephemeral environments).
   - Add Environmental Variable `FLASK_API_URL` pointing to the deployed ML server below.

3. **Machine Learning API ➔ Railway / Render**
   - Import project into Railway targeting `flask_ml_api`.
   - Ensure the runtime is set to Python. 
   - Expose the web-service using Gunicorn: `gunicorn app:app`.

---

[Screenshots Placeholder - Insert images of UI, Scan results, and the Dashboard]
>>>>>>> bbd76ae (Initial commit)
