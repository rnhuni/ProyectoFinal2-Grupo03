import os
import time
import boto3
import json
import threading

from ServicioReporte.commands.log_create import CreateLog
from ServicioReporte.commands.incident_create import CreateIncident
from ServicioReporte.commands.incident_update import UpdateIncident

class ReportService:
    def __init__(self):
        self.queue = os.getenv('REPORT_QUEUE_URL', '')
        self.stop_event = threading.Event()
        if os.getenv('ENV') != 'test':
            self.client = boto3.client('sqs', region_name=os.getenv('AWS_REGION', ''))

    def create_log(self, source_id, source_name, source_type, payload_str):
            payload = json.loads(payload_str)
            event_type = payload["event_type"]
            event_content = payload["event_content"]
            CreateLog(source_id, source_name, source_type, event_type, event_content).execute()

    def create_incident(self, source_id, source_name, payload_str):
            payload = json.loads(payload_str)
            client_id = payload["client_id"]
            incident_id = payload["incident_id"]
            channel_id = payload["channel_id"]
            channel_name = payload["channel_name"]
            sla = int(payload["sla"])
            CreateIncident(incident_id, 
                           client_id,
                           source_id, 
                           source_name, 
                           channel_id, 
                           channel_name, 
                           sla).execute()

    def to_claim_incident(self, source_id, source_name, payload_str):
            payload = json.loads(payload_str)
            incident_id = payload["incident_id"]
            
            UpdateIncident(incident_id=incident_id, 
                           incident_assigned_to_id=source_id, 
                           incident_assigned_to_name=source_name,
                           status='ASSIGNED').execute()

    def to_close_incident(self, source_id, source_name, payload_str):
            payload = json.loads(payload_str)
            incident_id = payload["incident_id"]
            sla_ok = bool(payload["sla_ok"])
            resolution_time = payload["resolution_time"]

            UpdateIncident(incident_id=incident_id, 
                           incident_closed_by_id=source_id, 
                           incident_closed_by_name=source_name,
                           sla_ok=sla_ok,
                           resolution_time=resolution_time,
                           status='CLOSED').execute()
            
    def create_feedback(self, payload_str):
            payload = json.loads(payload_str)
            incident_id = payload["incident_id"]
            feedback_id = payload["feedback_id"]
            feedback_support_rating = int(payload["feedback_support_rating"])
            feedback_ease_of_contact = int(payload["feedback_ease_of_contact"])
            feedback_support_staff_attitude = int(payload["feedback_support_staff_attitude"])
            feedback_resolution_time = int(payload["feedback_resolution_time"])

            UpdateIncident(incident_id=incident_id, 
                           feedback_id=feedback_id, 
                           feedback_support_rating=feedback_support_rating,
                           feedback_ease_of_contact=feedback_ease_of_contact,
                           feedback_support_staff_attitude=feedback_support_staff_attitude,
                           feedback_resolution_time=feedback_resolution_time).execute()

    def process_message(self, message):
        try:
            body = json.loads(message['Body'])
            action = body["action"]
            source_id = body["source_id"]
            source_name = body["source_name"]
            source_type = body["source_type"]
            payload = body["payload"]

            if action == "CREATE_LOG":
                self.create_log(source_id, source_name, source_type, payload)
            elif action == "CREATE_INCIDENT":
                self.create_incident(source_id, source_name, payload)
            elif action == "CLAIM_INCIDENT":
                self.to_claim_incident(source_id, source_name, payload)
            elif action == "CLOSE_INCIDENT":
                self.to_close_incident(source_id, source_name, payload)
            elif action == "CREATE_FEEDBACK":
                self.create_feedback(payload)
            else:
                print(f"ACTION={action} is not support")
        except Exception as e:
            print(f"Error processing message: {e}")

    def poll_queue(self):
        while not self.stop_event.is_set():
            try:
                response = self.client.receive_message(
                    QueueUrl=self.queue,
                    AttributeNames=['All'],
                    MessageAttributeNames=['All'],
                    MessageSystemAttributeNames=['MessageDeduplicationId', 'MessageGroupId']
                )

                if 'Messages' not in response:
                    time.sleep(1)
                    continue

                for message in response['Messages']:
                    self.process_message(message)

                    self.client.delete_message(
                        QueueUrl=self.queue,
                        ReceiptHandle=message['ReceiptHandle']
                    )
            except Exception as e:
                print(f"Error polling queue: {e}")
                time.sleep(1)

    def stop(self):
        self.stop_event.set()