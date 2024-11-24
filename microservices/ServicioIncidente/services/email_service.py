from io import StringIO
import os
import time
import boto3
import json
import threading
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import imaplib
import email
from datetime import datetime

from ServicioIncidente.commands.incident_create import CreateIncident
from ServicioIncidente.models.model import session
from ServicioIncidente.services.cognito_service import CognitoService
from ServicioIncidente.utils.utils import build_incident_id
from ServicioIncidente.services.monitor_service import MonitorService
from ServicioIncidente.services.report_service import ReportService

IMAP_SERVER = "imap.gmail.com"
IMAP_PORT = 993        

class EmailService:
    def __init__(self):
        self.email = os.getenv('EMAIL_ACCOUNT')
        self.password = os.getenv('EMAIL_PASSWORD')
        self.stop_event = threading.Event()
        if os.getenv('ENV') != 'test':
            self.sqs_client = boto3.client('sqs', region_name=os.getenv('AWS_REGION', ''))

    def send_error_email(self, to_email, original_subject):
        try:
            SMTP_SERVER = "smtp.gmail.com"
            SMTP_PORT = 587
            EMAIL_ACCOUNT = self.email
            EMAIL_PASSWORD = self.password

            msg = MIMEMultipart()
            msg['From'] = EMAIL_ACCOUNT
            msg['To'] = to_email
            msg['Subject'] = f"Re: {original_subject} - Registro no encontrado"

            body = ("Su email no está registrado en nuestro sistema. \n\nSi considera que esto es un error, comuniquese directamente con nuestros agentes.\n\nMuchas gracias")
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ACCOUNT, to_email, msg.as_string())
            server.quit()
        except Exception as e:
            print(f"send_error_email failed: {str(e)}")
    
    def send_confirmation_email(self, to_email, original_subject, incident):
        try:
            SMTP_SERVER = "smtp.gmail.com"
            SMTP_PORT = 587
            EMAIL_ACCOUNT = self.email
            EMAIL_PASSWORD = self.password

            msg = MIMEMultipart()
            msg['From'] = EMAIL_ACCOUNT
            msg['To'] = to_email
            msg['Subject'] = f"Re: {original_subject} - Confirmación de recepción"

            body = (f"Hola {incident.user_issuer_name}. Muchas gracias por comunicarte con nosotros. \n\nEl número de ticket de tu reclamo es {str(incident.id)} \n\nEn la brevedad un agente se pondra en contacto con usted")
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ACCOUNT, to_email, msg.as_string())
            server.quit()
        except Exception as e:
            print(f"send_confirmation_email failed: {str(e)}")

    def process_email(self, sender, subject, body):
        try:
            user = CognitoService().get_user(sender)
            if not user:
                self.send_error_email(sender, subject)
                return

            incident_id = build_incident_id()        
            data = CreateIncident(incident_id, 'email', body, None, user["id"], user["name"], \
                                'chan-email', '2880').execute()
            MonitorService().enqueue_event(user, "CREATE-INCIDENT", f"INCIDENT_ID={str(data.id)}")
            ReportService().enqueue_create_incident(user, data)
            
            self.send_confirmation_email(sender, subject, data)
        except Exception as e:
            print(f"Error processing message: {e}")
            session.rollback()
            session.remove()

    def poll_email(self):
        while not self.stop_event.is_set():
            mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
            mail.login(self.email, self.password)
            mail.select('inbox')
        
            status, messages = mail.search(None, 'UNSEEN')
            email_ids = messages[0].split()

            for e_id in email_ids:
                _, data = mail.fetch(e_id, '(RFC822)')
                raw_email = data[0][1]
                msg = email.message_from_bytes(raw_email)

                subject = msg['subject']
                sender = email.utils.parseaddr(msg['from'])[1]
                body = ""

                if msg.is_multipart():
                    for part in msg.walk():
                        if part.get_content_type() == "text/plain":
                            body = part.get_payload(decode=True).decode()
                            break
                else:
                    body = msg.get_payload(decode=True).decode()

                self.process_email(sender, subject, body)
                mail.store(e_id, '+FLAGS', '\\Seen')
            mail.logout()
            time.sleep(60) 

    def stop(self):
        self.stop_event.set()