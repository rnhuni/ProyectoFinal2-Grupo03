import boto3
import json
import os

ses_client = boto3.client('ses', region_name=os.getenv('AWS_REGION', 'us-east-1'))

SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'noreply@tu-dominio.com')

def lambda_handler(event, context):
    try:
        recipient_email = event['recipient_email']
        access_link = event['access_link']
        user_name = event.get('user_name', 'Usuario')
        
        subject = "Bienvenido a la plataforma"
        body_text = (f"Hola {user_name},\n\n"
                     "Tu cuenta ha sido creada con éxito. Puedes acceder a tu cuenta usando el siguiente enlace:\n\n"
                     f"{access_link}\n\n"
                     "Si tienes alguna pregunta, no dudes en contactarnos.")
        
        body_html = f"""
        <html>
        <head></head>
        <body>
          <h1>Bienvenido a la plataforma</h1>
          <p>Hola {user_name},</p>
          <p>Tu cuenta ha sido creada con éxito. Puedes acceder a tu cuenta usando el siguiente enlace:</p>
          <a href='{access_link}'>Acceder a mi cuenta</a>
          <br><br>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </body>
        </html>
        """
        
        response = ses_client.send_email(
            Source=SENDER_EMAIL,
            Destination={
                'ToAddresses': [recipient_email]
            },
            Message={
                'Subject': {
                    'Data': subject
                },
                'Body': {
                    'Text': {
                        'Data': body_text
                    },
                    'Html': {
                        'Data': body_html
                    }
                }
            }
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps(f"Email enviado a {recipient_email} correctamente.")
        }
        
    except KeyError as e:
        return {
            'statusCode': 400,
            'body': json.dumps(f"Error: Faltan parámetros necesarios: {str(e)}")
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error al enviar el email: {str(e)}")
        }