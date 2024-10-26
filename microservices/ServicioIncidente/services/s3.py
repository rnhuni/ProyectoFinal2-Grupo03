import os
import boto3

class S3Service:
    def __init__(self):
        if os.getenv('ENV') != 'test':
            self.s3_client = boto3.client('s3')
        self.bucket_name = os.getenv('BUCKET_NAME')

    def generate_upload_url(self, object_name, file_name, content_type, expiration):
        return self.s3_client.generate_presigned_url('put_object',\
                Params={
                        'Bucket': self.bucket_name,
                        'Key': object_name,
                        'ContentType': content_type,
                        'Metadata': {
                            'filename': file_name
                        }
                            
                }, ExpiresIn=expiration)
    
    def generate_download_url(self, object_name, expiration):
        return self.s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': object_name},
            ExpiresIn=expiration
        )