import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    
    # Initialize the model
    # Using gemini-1.5-flash as it is fast and efficient for conversational tasks
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 1024,
    }
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
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
        return f"Sorry, I encountered an error while processing your request: {e}"
