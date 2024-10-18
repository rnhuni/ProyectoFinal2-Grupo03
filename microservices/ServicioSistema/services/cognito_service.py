import boto3
import os

class CognitoService:
    def __init__(self):
        self.cognito_client = boto3.client('cognito-idp', region_name=os.getenv('AWS_REGION'))
        self.user_pool_id = os.getenv('USER_POOL_ID')
        self.client_id = os.getenv('CLIENT_ID')

    def register_user(self, email, password):
        response = self.cognito_client.admin_create_user(
            UserPoolId=self.user_pool_id,
            Username=email,
            TemporaryPassword=password,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
            ],
            MessageAction='RESEND'
        )
        return response
