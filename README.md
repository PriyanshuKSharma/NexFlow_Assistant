# AI-Powered Business Automation Assistant (NexFlow Assistant)

This project is an AI-powered business automation assistant built as part of the Codenixia assessment. It features a conversational AI interface, a lead capture system, an automated notification workflow, and an admin dashboard for data viewing.

## 🚀 Features

- **AI Assistant/Chatbot**: Built using the Gemini API, it can answer business and course-related queries interactively.
- **Lead Capture System**: A built-in form for users to submit their details (Name, Email, Phone, Query).
- **Data Storage**: Uses SQLite to persist lead data reliably.
- **Automation Workflow**: Simulates an automated process (e.g., email notification, internal Slack alert) upon lead submission via the Python `logging` module.
- **Admin Dashboard**: A separate view within the app to monitor captured leads, view statistics, and download data as CSV.

## 🏗️ Architecture

```mermaid
graph TD
    User([User]) -->|Interacts with Chat| App(Streamlit App)
    User -->|Submits Lead Form| App
    
    App <-->|Queries/Responses| LLM[Gemini API]
    App -->|Saves Lead| DB[(SQLite Database)]
    App -->|Triggers| Auto[Automation Module]
    
    DB -->|Reads Leads| AdminView[Admin Dashboard]
    Auto -->|Logs/Emails| Notification([Notification System])
    
    Admin([Admin]) -->|Views Dashboard| AdminView
```

## 🛠️ Technology Stack

- **Frontend & UI**: Streamlit
- **Backend**: Python
- **Database**: SQLite
- **LLM API**: Google Gemini (gemini-1.5-flash)
- **Deployment**: Docker-ready

## 💻 Local Setup Instructions

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd NexFlow_Assistant
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: The application will run even without the key, but the AI chatbot will be in offline mode).*

5. **Run the Application**:
   ```bash
   streamlit run app.py
   ```

6. **Access the App**:
   Open your browser and navigate to `http://localhost:8501`.

## 🐳 Docker Deployment

To build and run the application using Docker:

1. **Build the image**:
   ```bash
   docker build -t nexflow-assistant .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8501:8501 -e GEMINI_API_KEY="your_api_key" nexflow-assistant
   ```

## 🌐 Live Deployment
*(Add your live hosted link here after deploying to Streamlit Community Cloud, Render, or Railway)*

## 🎥 Demo Video
*(Add your 5-7 minute demo video link here)*
