from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os

router = APIRouter()

class ErrorReport(BaseModel):
    error_logs: str
    code_context: str | None = None

def init_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured in .env")
    genai.configure(api_key=api_key)
    # Using Gemini 1.5 Flash for fast, free, high-performance general text analysis
    return genai.GenerativeModel("gemini-1.5-flash")

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
