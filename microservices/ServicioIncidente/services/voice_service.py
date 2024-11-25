from io import StringIO
import os
import time
import uuid
import boto3
import json
import threading
import csv
from datetime import datetime

from ServicioIncidente.commands.incident_create import CreateIncident
from ServicioIncidente.utils.utils import build_incident_id
from ServicioIncidente.models.model import session
from ServicioIncidente.services.monitor_service import MonitorService
from ServicioIncidente.services.report_service import ReportService
from ServicioIncidente.services.cognito_service import CognitoService

class VoiceService:
    def __init__(self):
        self.queue_url = os.getenv('VOICE_QUEUE_URL', '')
        self.stop_event = threading.Event()
        if os.getenv('ENV') != 'test':
            self.sqs_client = boto3.client('sqs', region_name=os.getenv('AWS_REGION', ''))

    def process_message(self, message):
        try:
            body = json.loads(message['Body'])
            user_email = body["user_email"]
            type = body["incident_type"]
            description = body["incident_description"]
            user = CognitoService().get_user(user_email)
            if not user:
                print(f"User email {user_email} not fount")
                return
            
            incident_id = build_incident_id()        
            data = CreateIncident(incident_id, type, description, None, user["id"], user["name"], \
                                'chan-voice', '240').execute()
            MonitorService().enqueue_event(user, "CREATE-INCIDENT", f"INCIDENT_ID={str(data.id)}")
            ReportService().enqueue_create_incident(user, data)
        except Exception as e:
            print(f"Error processing message: {e}")
            session.rollback()
            session.remove()

    def poll_queue(self):
        while not self.stop_event.is_set():
            try:
                response = self.sqs_client.receive_message(
                    QueueUrl=self.queue_url,
                    AttributeNames=['All'],
                    MessageAttributeNames=['All'],
                    MessageSystemAttributeNames=['MessageDeduplicationId', 'MessageGroupId']
                )

                if 'Messages' not in response:
                    time.sleep(1)
                    continue

                for message in response['Messages']:
                    self.process_message(message)

                    self.sqs_client.delete_message(
                        QueueUrl=self.queue_url,
                        ReceiptHandle=message['ReceiptHandle']
                    )
            except Exception as e:
                print(f"Error polling queue: {e}")
                time.sleep(1)

    def stop(self):
        self.stop_event.set()