import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def trigger_lead_automation(lead_data):
    try:
        logging.info("AUTOMATION WORKFLOW TRIGGERED")
        logging.info("New Lead Captured: %s", lead_data.get("name"))
        logging.info("Email: %s", lead_data.get("email"))
        logging.info("Interest/Query: %s", lead_data.get("interest"))
        logging.info("Sending welcome email to %s...", lead_data.get("email"))
        logging.info("Sending internal sales notification...")
        return True
    except Exception as exc:
        logging.error("Automation failed: %s", exc)
        return False
