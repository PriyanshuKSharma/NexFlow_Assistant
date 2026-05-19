# pyrefly: ignore [missing-import]
import os
import google.generativeai as genai
from dotenv import load_dotenv

import streamlit as st

# Load environment variables
load_dotenv()

# Configure Gemini API
# Attempt to get API key from environment first, then from Streamlit Secrets
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    try:
        API_KEY = st.secrets["GEMINI_API_KEY"]
    except (FileNotFoundError, KeyError, Exception):
        API_KEY = None

MODEL_NAME = os.getenv("GEMINI_MODEL")
if not MODEL_NAME:
    try:
        MODEL_NAME = st.secrets.get("GEMINI_MODEL", "gemini-2.5-flash")
    except (FileNotFoundError, KeyError, Exception):
        MODEL_NAME = "gemini-2.5-flash"


if API_KEY:
    genai.configure(api_key=API_KEY)
    
    # Initialize the model
    # Gemini model can be changed from .env with GEMINI_MODEL.
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 1024,
    }
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=generation_config,
        system_instruction="You are an AI-Powered Business Automation Assistant for a company called NexFlow. You are helpful, professional, and knowledgeable about business automation, software development, and course offerings. Keep your answers concise, informative, and polite."
    )
else:
    model = None

def get_ai_response(user_message, chat_history=None):
    """
    Generates a response using the Gemini API.
    If the API key is not configured, returns a fallback message.
    """
    if not model:
        return "I am currently running in offline mode. Please configure the `GEMINI_API_KEY` in the environment variables to enable AI capabilities."
    
    try:
        # In a real app, you might want to pass chat_history to maintain context.
        # For simplicity, we're just sending the user message here, but Streamlit
        # can maintain session state.
        response = model.generate_content(user_message)
        return response.text
    except Exception as e:
        error_message = str(e)
        if "not found" in error_message and "models/" in error_message:
            return (
                "Sorry, the configured Gemini model is not available for this API key. "
                f"Set `GEMINI_MODEL=gemini-2.5-flash` in your `.env` file and restart the app. "
                f"Current model: `{MODEL_NAME}`."
            )
        return f"Sorry, I encountered an error while processing your request: {e}"
