import logging

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def trigger_lead_automation(lead_data):
    """
    Simulates an automation workflow when a new lead is captured.
    In a real-world scenario, this could be:
    - Sending an email via SMTP or SendGrid API
    - Pushing data to a CRM (e.g., Salesforce, HubSpot)
    - Sending a Slack/Discord notification
    """
    try:
        # Simulate sending a notification
        logging.info("="*50)
        logging.info("AUTOMATION WORKFLOW TRIGGERED")
        logging.info(f"New Lead Captured: {lead_data.get('name')}")
        logging.info(f"Email: {lead_data.get('email')}")
        logging.info(f"Interest/Query: {lead_data.get('interest')}")
        
        # Simulating email dispatch
        logging.info(f"Sending welcome email to {lead_data.get('email')}...")
        # (Imagine SMTP code here)
        logging.info("Email sent successfully.")
        
        # Simulating internal team notification
        logging.info("Sending internal Slack notification to Sales team...")
        # (Imagine webhook code here)
        logging.info("Notification sent.")
        logging.info("="*50)
        
        return True
    except Exception as e:
        logging.error(f"Automation failed: {e}")
        return False
