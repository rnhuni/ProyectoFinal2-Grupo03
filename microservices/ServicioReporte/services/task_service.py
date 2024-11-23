from io import StringIO
import os
import time
import uuid
import boto3
import json
import threading
import csv
from datetime import datetime

from ServicioReporte.commands.task_update import UpdateTask
from ServicioReporte.commands.task_get import GetTask

class TaskService:
    def __init__(self):
        self.queue_url = os.getenv('TASK_QUEUE_URL', '')
        self.bucket_name = os.getenv('TASK_BUCKET_NAME')
        self.stop_event = threading.Event()
        if os.getenv('ENV') != 'test':
            self.s3_client = boto3.client('s3')
            self.sqs_client = boto3.client('sqs', region_name=os.getenv('AWS_REGION', ''))

    def generate_download_url(self, object_name, expiration):
        return self.s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': object_name},
            ExpiresIn=expiration
        )
    
    def enqueue_task(self, task_id):
        try:
            body = json.dumps({
                "task_id": task_id
            })

            response = self.sqs_client.send_message(
                QueueUrl=self.queue_url,
                MessageBody=body,
                MessageGroupId="report-group",
                MessageDeduplicationId=str(uuid.uuid4())
            )

            return response.get('MessageId', None)
        except Exception as e:
            print(f"enqueue_event failed: {e}")
            raise

    def process_message(self, message):
        try:
            body = json.loads(message['Body'])
            
            task_id = body["task_id"]

            task = GetTask(task_id).execute()
            if not task:
                print(f"Task id {task_id} not found")

            filters = json.loads(task.filters)
            source_id = filters["source_id"]
            event_type = filters["event_type"]
            order = filters["order"]
            start_date_str = filters["start_date"]
            end_date_str = filters["end_date"]

            start_date = None
            end_date = None
            if start_date_str:
                start_date = datetime.fromisoformat(start_date_str)
            if end_date_str:
                end_date = datetime.fromisoformat(end_date_str)

            logs = GetLogs(
                source_id=source_id, 
                event_type=event_type, 
                start_date=start_date, 
                end_date=end_date,
                order=order
            ).execute()

            csv_buffer = StringIO()
            csv_writer = csv.writer(csv_buffer)

            header = ['Log ID', 'Source ID', 'Source Name', 'Source Type', 
                    'Event Type', 'Event Content', 'Created At', 'Updated At']
            csv_writer.writerow(header)

            for log in logs:
                csv_writer.writerow([
                    log.id,
                    log.source_id,
                    log.source_name,
                    log.source_type,
                    log.event_type,
                    log.event_content,
                    log.createdAt.isoformat() if log.createdAt else None,
                    log.updatedAt.isoformat() if log.updatedAt else None
                ])

            csv_buffer.seek(0)
            s3_key = f"{task_id}.csv"
            self.s3_client.put_object(Bucket=self.bucket_name, Key=s3_key, Body=csv_buffer.getvalue())
            UpdateTask(task=task, key=s3_key, status="COMPLETED").execute()
        except Exception as e:
            print(f"Error processing message: {e}")

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