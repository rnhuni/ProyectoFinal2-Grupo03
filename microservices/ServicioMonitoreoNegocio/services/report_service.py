import os
import boto3
import json
import uuid

class ReportService:
    def __init__(self):
        self.queue_url = os.getenv('REPORT_QUEUE_URL', '')
        if os.getenv('ENV') != 'test':
            self.client = boto3.client('sqs', region_name=os.getenv('AWS_REGION', ''))

    def enqueue_create_log(self, source_id, source_name, source_type, event_type, event_content):
        try:
            print("enqueue_create_log")
            body = json.dumps({
                "action": "CREATE_LOG",
                "source_id": source_id,
                "source_name": source_name,
                "source_type": source_type,
                "source_client": "",
                "payload": {
                    "event_type": event_type,
                    "event_content": event_content
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

    
