import os
import time
import boto3
import json
import threading

from ServicioMonitoreoNegocio.commands.log_create import CreateLog

class MonitorService:
    def __init__(self):
        self.queue = os.getenv('MONITOR_QUEUE_URL', '')
        self.stop_event = threading.Event()
        if os.getenv('ENV') != 'test':
            self.client = boto3.client('sqs', region_name=os.getenv('AWS_REGION', ''))

    def process_message(self, message):
        try:
            body = json.loads(message['Body'])

            source_id = body["source_id"]
            source_name = body["source_name"]
            source_type = body["source_type"]
            event_type = body["event_type"]
            event_content = body["event_content"]

            CreateLog(source_id, source_name, source_type, event_type, event_content).execute()
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