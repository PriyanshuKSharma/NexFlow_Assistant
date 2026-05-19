import os

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if API_KEY:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config={
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 1024,
        },
        system_instruction=(
            "You are NexFlow Assistant, a concise AI business automation consultant. "
            "Answer business, course, automation, CRM, AI, and software queries in a helpful professional tone."
        ),
    )
else:
    model = None


def get_ai_response(message):
    if not model:
        return "AI mode is offline. Configure GEMINI_API_KEY in the backend environment."

    try:
        response = model.generate_content(message)
        return response.text
    except Exception as exc:
        error_message = str(exc)
        if "not found" in error_message and "models/" in error_message:
            return f"The configured Gemini model `{MODEL_NAME}` is unavailable. Set GEMINI_MODEL=gemini-2.5-flash."
        return f"Sorry, I encountered an error while processing your request: {exc}"
