import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Health AI Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomRequest(BaseModel):
    symptoms: str

class ChatRequest(BaseModel):
    message: str

@app.post("/predict-disease")
def predict_disease(request: SymptomRequest):
    # Placeholder for AI model interaction using GEMINIAI_API_KEY
    # Example logic mapping based on symptoms
    return {
        "possible_conditions": [
            {"condition": "Common Cold", "probability": 0.85},
            {"condition": "Allergic Rhinitis", "probability": 0.60}
        ],
        "risk_score": 30,
        "severity": "Low Severity"
    }

@app.post("/ai-chat")
def ai_chat(request: ChatRequest):
    # Placeholder for Chatbot logic using GEMINIAI_API_KEY
    response = "I understand you are feeling unwell. Based on what you shared, it could be minor fatigue. Make sure to rest."
    return {"response": response}

@app.post("/speech-to-text")
def speech_to_text(audio: UploadFile = File(...)):
    # Placeholder for Whisper AI integration using WHISPER_API_KEY
    return {"text": "Patient mentioned feeling tired and having a slight cough."}

@app.post("/text-to-speech")
def text_to_speech(text: str):
    # Placeholder for Google TTS
    # Return mock audio file path or stream
    return {"audio_url": "/mock-audio.mp3"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
