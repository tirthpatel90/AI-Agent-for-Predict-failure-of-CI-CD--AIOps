# AutoHeal - Autonomous Pipeline Healing Platform

AutoHeal is an autonomous CI/CD intelligence and healing platform designed to detect, analyze, and repair pipeline failures before code even leaves the developer's machine. By providing a "pre-push" intelligence layer, it ensures that only healthy code enters the integration stage.

## 💡 The Problem
In modern software development, developers often commit code and wait for CI/CD pipelines to fail before discovering obvious configuration drifts, dependency conflicts, or environment mismatches. This "wait-and-fail" cycle wastes thousands of compute hours and developer productivity every day.

## ✨ The Solution
AutoHeal acts as an autonomous healing layer. Currently, the platform allows developers to paste a repository URL to perform a deep scan of the repository's CI/CD structure and dependencies. It predicts potential failures in the "Working Phase"—identifying issues before a push is even initiated.

---

## 🚀 Key Features

### 🛠️ Pre-Push Failure Detection
Analyze your repository context and CI configurations (`.github/workflows`, `Jenkinsfile`, etc.) to calculate a failure probability score before you initiate a deployment.

### ⚡ Rapid Intelligence Scanning
Utilizes high-performance recursive tree mapping to analyze entire repository structures in seconds, ensuring complete coverage of even the largest monorepos.

### 📊 Real-Time Pipeline Intelligence
A comprehensive dashboard provides a unified view of your build history, success metrics, and average durations, allowing project leads to monitor health levels at a glance.

### 🔦 Deep Log Analysis
Fetch and analyze live GitHub Actions logs. The system identifies specific job failures and provides autonomous repair suggestions to keep the development cycle fluid.

### 🌀 Multi-Context Management
Maintain a connected set of repositories and switch between them instantly to monitor the health of your entire portfolio from a single interface.

---

## 🛠️ Technology Stack

| Platform Layer | Technology |
|---|---|
| **Intelligence Engine** | High-performance Python backend for rapid file-tree analysis |
| **Logic Framework** | FastAPI (Asynchronous stream handling) |
| **Interface** | Next.js with "Studio Zen" design system (Fluid animations) |
| **Data Engine** | Framer Motion & Recharts for real-time visualization |

---

## 🚀 Setup Guide

### 1. Prerequisites
- **Node.js 18+** & **Python 3.10+**
- **GitHub Personal Access Token** (Required for secure repository indexing)
- **AI Access Token** (Required for the healing engine)

### 2. Engine Setup (Backend)
```bash
cd autoheal-backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
# Configure your .env with necessary access tokens
python main.py
```

### 3. Interface Setup (Frontend)
```bash
cd autoheal-ci
npm install
npm run dev
```

Visit `http://localhost:3000` to start healing your pipelines.

---

## 🤝 Open Source & Contributing
AutoHeal is an open-source project and we welcome contributions from the community! Whether you are fixing a bug, suggesting a new feature, or improving the healing logic:
- **Feel free to contribute!** 
- Fork the repository, create your feature branch, and submit a PR.
- Let's build the future of autonomous DevOps together.
