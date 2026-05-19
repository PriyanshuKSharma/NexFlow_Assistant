# pyrefly: ignore [missing-import]
import streamlit as st
import pandas as pd
from database import init_db, insert_lead, get_all_leads
from ai_assistant import get_ai_response
from automation import trigger_lead_automation

# Initialize database
init_db()

# Configure Streamlit Page
st.set_page_config(
    page_title="NexFlow Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for UI improvement
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #1E3A8A;
        font-weight: 700;
        margin-bottom: 0px;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #4B5563;
        margin-bottom: 20px;
    }
    .stButton>button {
        background-color: #2563EB;
        color: white;
        border-radius: 5px;
        padding: 10px 24px;
        font-weight: bold;
    }
    .stButton>button:hover {
        background-color: #1D4ED8;
    }
</style>
""", unsafe_allow_html=True)

def render_assistant_page():
    st.markdown('<div class="main-header">🤖 AI-Powered Business Assistant</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Ask me anything about our business, or submit your details to connect with us!</div>', unsafe_allow_html=True)

    col1, col2 = st.columns([2, 1])

    with col1:
        st.subheader("Chat with NexFlow")
        
        # Initialize chat history
        if "messages" not in st.session_state:
            st.session_state.messages = []

        # Display chat history
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])

        # Chat input
        if prompt := st.chat_input("How can I help you today?"):
            # Display user message
            st.chat_message("user").markdown(prompt)
            st.session_state.messages.append({"role": "user", "content": prompt})

            # Get AI response
            with st.spinner("Thinking..."):
                response = get_ai_response(prompt)
                
            # Display assistant response
            with st.chat_message("assistant"):
                st.markdown(response)
            st.session_state.messages.append({"role": "assistant", "content": response})

    with col2:
        st.subheader("📝 Request a Callback")
        st.write("Leave your details and our team will get back to you.")
        
        with st.form("lead_form"):
            name = st.text_input("Full Name", placeholder="John Doe")
            email = st.text_input("Email Address", placeholder="john@example.com")
            phone = st.text_input("Phone Number (Optional)", placeholder="+1 234 567 8900")
            interest = st.text_area("How can we help you?", placeholder="I am interested in your automation services...")
            
            submitted = st.form_submit_button("Submit Request")
            
            if submitted:
                if not name or not email:
                    st.error("Please provide at least your Name and Email.")
                else:
                    # 1. Save to Database
                    insert_lead(name, email, phone, interest)
                    
                    # 2. Trigger Automation Workflow
                    lead_data = {
                        "name": name,
                        "email": email,
                        "phone": phone,
                        "interest": interest
                    }
                    trigger_lead_automation(lead_data)
                    
                    st.success("Thank you! Your request has been received. We will contact you shortly.")

def render_admin_dashboard():
    st.markdown('<div class="main-header">📊 Admin Dashboard</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">View and manage captured leads.</div>', unsafe_allow_html=True)
    
    # In a real application, you would add authentication here.
    # For this assessment, we'll just display the data.
    
    leads_df = get_all_leads()
    
    if leads_df.empty:
        st.info("No leads captured yet. They will appear here once submitted.")
    else:
        # High level metrics
        col1, col2, col3 = st.columns(3)
        col1.metric("Total Leads", len(leads_df))
        col2.metric("New Leads (Today)", len(leads_df)) # Simplified for demo
        col3.metric("Response Rate", "100%") # Simulated metric
        
        st.subheader("Recent Leads")
        st.dataframe(
            leads_df,
            column_config={
                "id": "ID",
                "name": "Name",
                "email": "Email",
                "phone": "Phone",
                "interest": "Interest / Query",
                "status": "Status",
                "created_at": st.column_config.DatetimeColumn("Submitted At", format="D MMM YYYY, h:mm a")
            },
            hide_index=True,
            use_container_width=True
        )
        
        # Adding a download button for CSV export
        csv = leads_df.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="Download data as CSV",
            data=csv,
            file_name='nexflow_leads.csv',
            mime='text/csv',
        )

# Main Navigation
st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["Assistant", "Admin Dashboard"])

st.sidebar.markdown("---")
st.sidebar.info(
    "**NexFlow Assistant**\n\n"
    "This is an assessment project demonstrating AI integration, "
    "lead capture, and automation workflows."
)

if page == "Assistant":
    render_assistant_page()
else:
    render_admin_dashboard()
