# AutoHeal CI - AI-Powered CI/CD Predictive Platform

AutoHeal CI is an industry-level, AI-driven CI/CD platform designed to predict deployment failures, automatically suggest fixes, and provide comprehensive insights into pipeline health. It operates as a full-stack platform featuring a powerful Python AI Engine and a premium Next.js dashboard.

## 🚀 Recent Progress: Full-Stack Integration
The project has successfully transitioned from a frontend-only prototype to a fully integrated, end-to-end application.

- **Real-Time Data Layer**: Replaced all mock data with real-time GitHub API integration.
- **Global State Management**: Implemented a React Context-based `RepoContext` for seamless repository switching across the dashboard.
- **Fast AI Scanning**: Leverages GitHub's **Git Trees API** and **Gemini 2.5 Flash** for lightning-fast, comprehensive repository analysis.
- **Secure Persistence**: Implemented server-side persistence for connected repositories.

---

## 🛠️ Components

### 1. `autoheal-ci` (Next.js Dashboard)
- **Premium UI**: "Studio Zen" design system using Glassmorphism with Framer Motion animations.
- **Dynamic Dashboards**: Real-time visualization of commits, workflow runs, and job logs.
- **AI Predictions**: Integrated risk assessment gauge and detailed failure cause analysis.
- **Repo Selector**: Global dropdown to switch context between any connected public repository.

### 2. `autoheal-backend` (FastAPI AI Engine)
- **GitHub Integration**: Robust API layer for connecting public repos, fetching workflows, and streaming logs.
- **AI Healer**: Advanced predictive engine using Gemini 2.5 Flash to analyze repository structure and CI configs.
- **Tree Scanning**: Recursively scans thousands of files in milliseconds to identify CI/CD patterns.

---

## 🌟 Key Features
- **Predictive Failure Analysis:** Analyzes repository context, CI configurations, and recent commit history to predict failure probability *before* you run your pipeline.
- **Live Build History:** Fetches and visualizes real GitHub Actions history with duration and status tracking.
- **Real-Time Logs:** Streams detailed job step logs directly to the dashboard for instant debugging.
- **Interactive Visualizer:** Node-based interactive flow diagrams for monitoring CI/CD stages.
- **Premium Aesthetics:** Dark-mode optimized, curated color palettes, and fluid micro-animations.

---

## 🚀 Getting Started

To run the full-stack application locally:

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- [Gemini API Key](https://aistudio.google.com/app/apikey)
- [GitHub Personal Access Token](https://github.com/settings/tokens) (Public repo scope)

### 2. Start the AI Backend
```bash
cd autoheal-backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
# Create .env with GITHUB_ACCESS_TOKEN and GEMINI_API_KEY
python main.py
```

### 3. Start the Frontend Dashboard
```bash
cd autoheal-ci
npm install
npm run dev
```

Visit `http://localhost:3000` to start connecting repositories.

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 16, React 19, Framer Motion, Recharts
- **Backend**: FastAPI, HTTPX, Pydantic, Python 3.13
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **Styling**: Vanilla CSS (Studio Zen Design System)
- **API**: GitHub REST API + Git Trees API
