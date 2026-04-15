from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os

router = APIRouter()

class ErrorReport(BaseModel):
    error_logs: str
    code_context: str | None = None

class PredictRequest(BaseModel):
    repo_context: str
    ci_config: str | None = None
    recent_logs: str | None = None

def init_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured in .env")
    genai.configure(api_key=api_key)
    # Using Gemini 1.5 Flash for fast, free, high-performance general text analysis
    return genai.GenerativeModel("models/gemini-2.5-flash")

@router.post("/analyze")
async def analyze_error(report: ErrorReport):
    """
    Takes a build error and code context and asks Gemini to find a fix.
    """
    model = init_gemini()
    
    prompt = f"""
    You are an expert CI/CD and coding assistant.
    Analyze the following build error and provide a fix.
    
    Error Logs:
    {report.error_logs}
    
    Code Context (if any):
    {report.code_context or "None provided"}
    
    Provide your response in the following JSON format strictly:
    {{
        "predicted_cause": "Short description of what went wrong",
        "suggested_fix": "The exact code modifications or commands to run to fix the error"
    }}
    Do not return markdown around the JSON, just the JSON string.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean up possible markdown wrappers from the response
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        
        return {"result": text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict")
async def predict_pipeline(request: PredictRequest):
    """
    Predict pipeline success/failure based on repo context, CI config, and recent logs.
    Returns structured prediction with failure probability and detailed reasons.
    """
    model = init_gemini()

    prompt = f"""
You are an expert CI/CD engineer and DevOps specialist. Based on the following context, predict whether the next CI/CD pipeline run will succeed or fail.

Repository Context:
{request.repo_context}

CI/CD Configuration:
{request.ci_config or "Not provided"}

Recent Build Logs:
{request.recent_logs or "Not provided"}

Provide your analysis in the following JSON format strictly:
{{
    "failure_probability": 0.0 to 1.0,
    "risk_level": "low" | "medium" | "high" | "critical",
    "likely_causes": [
        {{"cause": "description of potential issue", "confidence": 0.0 to 1.0}}
    ],
    "summary": "Brief overall assessment",
    "recommendations": ["recommendation 1", "recommendation 2"],
    "detailed_errors": [
        {{
            "error_type": "type of error (dependency, config, test, build, etc.)",
            "description": "what could go wrong",
            "severity": "low" | "medium" | "high",
            "fix_suggestion": "how to fix it"
        }}
    ]
}}
Do not wrap in markdown code blocks. Return only the raw JSON.
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]

        import json
        result = json.loads(text.strip())
        return {"prediction": result}

    except Exception as e:
        return {"prediction": {
            "failure_probability": 0.5,
            "risk_level": "medium",
            "likely_causes": [{"cause": f"Analysis error: {str(e)}", "confidence": 0.3}],
            "summary": "Could not complete analysis",
            "recommendations": ["Try again or check API key"],
            "detailed_errors": []
        }}
