import boto3
import os

class CognitoService:
    def __init__(self):
        self.cognito_client = boto3.client('cognito-idp', region_name=os.getenv('AWS_REGION'))
        self.user_pool_id = os.getenv('USER_POOL_ID')

    def get_user(self, email):
        try:
            response = self.cognito_client.admin_get_user(
                UserPoolId=self.user_pool_id,
                Username=email
            )

            attributes = {attr['Name']: attr['Value'] for attr in response.get('UserAttributes', [])}

            user = {
                "id": attributes.get('sub'),
                "name": attributes.get('name'),
                "role_type": attributes.get('custom:role', '').split("-")[1] if 'custom:role' in attributes else None,
                "client": attributes.get('custom:client')
            }
            return user

        except Exception as e:
            print(f"get_user failed: {e}")