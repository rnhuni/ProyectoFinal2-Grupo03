import boto3
import os

class CognitoService:
    def __init__(self):
        self.cognito_client = boto3.client('cognito-idp', region_name=os.getenv('AWS_REGION'))
        self.user_pool_id = os.getenv('USER_POOL_ID')

    def register_user(self, name, email, client, role, permissions, features):
        response = self.cognito_client.admin_create_user(
            UserPoolId=self.user_pool_id,
            Username=email,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
                {'Name': 'name', 'Value': name},
                {'Name': 'custom:client', 'Value': client},
                {'Name': 'custom:role', 'Value': role},
                {'Name': 'custom:permissions', 'Value': permissions},
                {'Name': 'custom:features', 'Value': features},
            ]
        )

        return response

    def get_user_status(self, email):
        response = self.cognito_client.admin_get_user(
            UserPoolId=self.user_pool_id,
            Username=email
        )
        
        user_status = response.get('UserStatus', 'UNKNOWN')
        return user_status
