import boto3
import os

class CognitoService:
    def __init__(self):
        if os.getenv('ENV') != 'test':
            self.cognito_client = boto3.client('cognito-idp', region_name=os.getenv('AWS_REGION', ''))
        self.user_pool_id = os.getenv('USER_POOL_ID')

    def get_all_agents(self):
        agents = []
        try:            
            paginator = self.cognito_client.get_paginator('list_users')
            for page in paginator.paginate(UserPoolId=self.user_pool_id):
                for user in page['Users']:
                    attributes = {attr['Name']: attr['Value'] for attr in user.get('Attributes', [])}

                    role = attributes.get('custom:role', '')
                    if role.startswith('role-agent'):
                        agents.append({
                            "id": attributes.get('sub'),
                            "name": attributes.get('name'),
                            "email": attributes.get('email'),
                            "role_type": role,
                            "client": attributes.get('custom:client')
                        })
            return agents
        except Exception as e:
            print(f"get_all_agents failed: {e}")
            return []
