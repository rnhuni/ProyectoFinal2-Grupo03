import os
import boto3
import json
import uuid

from ServicioIncidente.utils.utils import build_channel_name

class ReportService:
    def __init__(self):
        self.queue_url = os.getenv('REPORT_QUEUE_URL', '')
        if os.getenv('ENV') != 'test':
            self.client = boto3.client('sqs', region_name=os.getenv('AWS_REGION', ''))

    def enqueue_create_incident(self, user, incident):
        try:
            source_id = user["id"]
            source_name = user["name"]
            source_type = user["role_type"]
            source_client = user["client"]
            body = json.dumps({
                "action": "CREATE_INCIDENT",
                "source_id": source_id,
                "source_name": source_name,
                "source_type": source_type,
                "source_client": source_client,
                "payload": {
                    "incident_id": incident.id,
                    "channel_id": incident.publication_channel_id,
                    "channel_name": build_channel_name(incident.publication_channel_id),
                    "created_at": incident.createdAt.isoformat(),
                    "sla": incident.sla
                }
            })

            response = self.client.send_message(
                QueueUrl=self.queue_url,
                MessageBody=body,
                MessageGroupId="report-group",
                MessageDeduplicationId=str(uuid.uuid4())
            )

            return response.get('MessageId', None)
        except Exception as e:
            print(f"enqueue_event failed: {e}")
            raise

    def enqueue_claim_incident(self, user, incident):
        try:
            source_id = user["id"]
            source_name = user["name"]
            source_type = user["role_type"]
            source_client = user["client"]
            body = json.dumps({
                "action": "CLAIM_INCIDENT",
                "source_id": source_id,
                "source_name": source_name,
                "source_type": source_type,
                "source_client": source_client,
                "payload": {
                    "incident_id": incident.id
                }
            })

            response = self.client.send_message(
                QueueUrl=self.queue_url,
                MessageBody=body,
                MessageGroupId="report-group",
                MessageDeduplicationId=str(uuid.uuid4())
            )

            return response.get('MessageId', None)
        except Exception as e:
            print(f"enqueue_event failed: {e}")
            raise

    def enqueue_close_incident(self, user, incident):
        try:
            source_id = user["id"]
            source_name = user["name"]
            source_type = user["role_type"]
            source_client = user["client"]
            body = json.dumps({
                "action": "CLOSE_INCIDENT",
                "source_id": source_id,
                "source_name": source_name,
                "source_type": source_type,
                "source_client": source_client,
                "payload": {
                    "incident_id": incident.id,
                    "sla_ok": incident.resolution_time <= incident.sla,
                    "resolution_time": incident.resolution_time
                }
            })

            response = self.client.send_message(
                QueueUrl=self.queue_url,
                MessageBody=body,
                MessageGroupId="report-group",
                MessageDeduplicationId=str(uuid.uuid4())
            )

            return response.get('MessageId', None)
        except Exception as e:
            print(f"enqueue_event failed: {e}")
            raise

    def enqueue_create_feedback(self, user, feedback):
        try:
            source_id = user["id"]
            source_name = user["name"]
            source_type = user["role_type"]
            source_client = user["client"]
            body = json.dumps({
                "action": "CREATE_FEEDBACK",
                "source_id": source_id,
                "source_name": source_name,
                "source_type": source_type,
                "source_client": source_client,
                "payload": {
                    "feedback_id": str(feedback.id),
                    "incident_id": feedback.incident_id,
                    "feedback_support_rating": feedback.support_rating,
                    "feedback_ease_of_contact": feedback.ease_of_contact,
                    "feedback_support_staff_attitude": feedback.support_staff_attitude,
                    "feedback_resolution_time": feedback.resolution_time,
                }
            })

            response = self.client.send_message(
                QueueUrl=self.queue_url,
                MessageBody=body,
                MessageGroupId="report-group",
                MessageDeduplicationId=str(uuid.uuid4())
            )

            return response.get('MessageId', None)
        except Exception as e:
            print(f"enqueue_event failed: {e}")
            raise
