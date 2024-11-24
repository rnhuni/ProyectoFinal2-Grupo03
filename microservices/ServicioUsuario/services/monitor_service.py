import os
import boto3
import json
import uuid

class MonitorService:
    def __init__(self):
        self.queue_url = os.getenv('MONITOR_QUEUE_URL', '')
        if os.getenv('ENV') != 'test':
            self.client = boto3.client('sqs', region_name=os.getenv('AWS_REGION', ''))

    def enqueue_event(self, user, event_type, event_content):
        try:
            source_id = user["id"]
            source_name = user["name"]
            source_type = user["role_type"]
            body = json.dumps({
                "source_id": source_id,
                "source_name": source_name,
                "source_type": source_type,
                "event_content": event_content,
                "event_type": event_type                
            })

            response = self.client.send_message(
                QueueUrl=self.queue_url,
                MessageBody=body,
                MessageGroupId="log-group",
                MessageDeduplicationId=str(uuid.uuid4())
            )

            return response.get('MessageId', None)
        except Exception as e:
            print(f"enqueue_event failed: {e}")
            raise
