# AutoHeal CI - AI-Powered CI/CD Predictive Platform

AutoHeal CI is an industry-level, AI-driven CI/CD platform designed to predict deployment failures, automatically suggest fixes, and provide comprehensive insights into pipeline health. It operates as a full-stack monorepo featuring a powerful Python AI Engine and a premium Next.js dashboard.

## Overview

This repository contains two primary components:
1. **`autoheal-ci`**: The Next.js frontend dashboard featuring a premium "Dark Glass" UI/UX with physics-based animations.
2. **`autoheal-backend`**: A fast, secure Python FastAPI backend that interfaces with GitHub and uses the Google Gemini AI API to provide code analysis and automated patching.

---

## 🌟 Key Features
- **Predictive Failure Analysis:** Monitors commits and build parameters to predict the probability of failure before deployment.
- **Auto-Fix Engine (Python AI):** Automatically suggests or applies fixes using a growing AI knowledge base. It leverages Google Gemini's reasoning to parse terminal outputs and return exact code patches.
- **Interactive Pipeline Visualizer:** Beautiful, node-based interactive flow diagrams to monitor CI/CD stages in real-time.
- **Live GitHub Syncing:** Securely connects to your GitHub account to stream repository metrics and pipeline outcomes directly to the UI.
- **Premium Glassmorphism UI:** Built with Framer Motion and Tailwind CSS v4, featuring custom glow gradients, animated charts, and fluid transitions.

---

## 🚀 Getting Started

This is a full-stack mono-repo. To run the application locally, you will need two separate terminal windows.

### 1. Start the AI Backend (Terminal 1)
The backend runs on Python `FastAPI` and listens on `http://localhost:8000`.

```bash
cd autoheal-backend

# Activate your virtual environment and install requirements (first time only)
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Create your .env file
# -> Add GITHUB_ACCESS_TOKEN and GEMINI_API_KEY inside the .env file

# Run the backend server
python -m uvicorn main:app --port 8000 --reload
```

### 2. Start the Frontend Dashboard (Terminal 2)
The frontend uses Next.js 16 and listens on `http://localhost:3000`.

```bash
cd autoheal-ci

# Install Node dependencies (first time only)
npm install

# Start the Next.js development server
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to experience the AutoHeal CI platform.

---

## 🛠️ Technology Stack
- **Frontend Framework:** Next.js 16 (App Router + React 19)
- **Backend Framework:** Python 3 (FastAPI, Uvicorn, HTTPX)
- **AI Infrastructure:** Google Generative AI (Gemini Flash)
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Data Visualization:** Recharts
