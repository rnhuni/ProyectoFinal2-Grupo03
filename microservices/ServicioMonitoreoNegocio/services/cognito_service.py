import boto3
import os

class CognitoService:
    def __init__(self):
        if os.getenv('ENV') != 'test':
            self.cognito_client = boto3.client('cognito-idp', region_name=os.getenv('AWS_REGION', ''))
        self.user_pool_id = os.getenv('USER_POOL_ID')

    def get_user_status(self, email):
        response = self.cognito_client.admin_get_user(
            UserPoolId=self.user_pool_id,
            Username=email
        )
        
        user_status = response.get('UserStatus', 'UNKNOWN')
        return user_status
