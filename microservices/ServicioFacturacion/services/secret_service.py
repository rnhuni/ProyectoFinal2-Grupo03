import os
import boto3
import json

class SecretService:
    def __init__(self, secret_name, region_name):
        self.secret_name = secret_name
        if os.getenv('ENV') != 'test':
            self.client = boto3.client("secretsmanager", region_name=region_name)

    def load_secret_to_env(self):
        try:
            response = self.client.get_secret_value(SecretId=self.secret_name)
            secret_values = response.get("SecretString")

            if secret_values:
                secret_dict = json.loads(secret_values)
                for key, value in secret_dict.items():
                    os.environ[key] = value
            else:
                print("Empty secrets")
        except Exception as e:
            print(f"load_secret_to_env failed. Details: {e}")
