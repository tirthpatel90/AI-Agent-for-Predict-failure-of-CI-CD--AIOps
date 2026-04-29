# 🚀 AutoHeal CI: Autonomous DevOps Intelligence

AutoHeal CI is a state-of-the-art, AI-powered platform designed to predict, analyze, and automatically resolve CI/CD pipeline failures before they impact your production flow. By integrating deep repository analysis with Google Gemini's advanced reasoning, AutoHeal CI transforms traditional "fail-and-fix" cycles into a proactive, autonomous ecosystem.

---

## ✨ Key Features

- **🔮 Predictive Health Analysis**: Uses AI to scan repository structures, CI configs, and recent commits to predict failure probability and identify risks.
- **🛠️ AI-Powered Healer**: Automatically analyzes build logs and code context to provide exact code fixes for failed pipelines.
- **📊 Real-time Dashboard**: A high-fidelity, Cyber-Glass aesthetic dashboard to monitor all connected repositories and their pipeline statuses.
- **🔗 Seamless GitHub Integration**: Connect any public repository instantly to start monitoring its health.
- **🔒 Secure Architecture**: Implements JWT-based authentication with httpOnly cookies and hashed password storage.

---

## 🏗️ Technology Stack

### Frontend (Dashboard)
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion & Lucide React
- **Visualization**: Recharts & Three.js

### Backend (Intelligence Engine)
- **Framework**: FastAPI (Python 3.13)
- **AI Engine**: Google Gemini 2.0 Flash
- **Database**: Lightweight JSON Persistence (Extensible to PostgreSQL)
- **Security**: JWT (HS256), Bcrypt, CORS Middleware

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.13+
- [Google AI Studio API Key](https://aistudio.google.com/app/apikey)

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tirthpatel90/AutoHeal-CI.git
   cd AutoHeal-CI
   ```

2. **Configure Backend**:
   ```bash
   cd autoheal-backend
   python -m venv venv
   source venv/bin/scripts/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
   Create a `.env` file in `autoheal-backend/`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET_KEY=your_secure_random_secret
   GITHUB_ACCESS_TOKEN=optional_github_token_for_higher_limits
   ```

3. **Configure Frontend**:
   ```bash
   cd ../autoheal-ci
   npm install
   ```

4. **Run with Docker (Recommended)**:
   ```bash
   docker-compose up --build
   ```

---

## 🐳 Docker Support

The project includes full Docker support for easy deployment and development.
- **Backend**: Runs on `http://localhost:8000`
- **Frontend**: Runs on `http://localhost:3000`

To start everything:
```bash
docker-compose up
```

---

## 🧪 CI/CD Pipeline

The project uses GitHub Actions (`.github/workflows/ci.yml`) for automated testing:
- **Frontend Build**: Validates Next.js build and TypeScript compilation.
- **Backend Smoke Test**: Ensures the FastAPI server starts successfully and all dependencies are resolved.

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---
*Built with ❤️ for the DevOps Community.*
