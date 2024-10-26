import os

CONNECTION_STRING = (
    f"postgresql://{os.getenv('RDS_USERNAME')}:{os.getenv('RDS_PASSWORD')}@"
    f"{os.getenv('RDS_HOSTNAME')}:{os.getenv('RDS_PORT')}/{os.getenv('RDS_DB_NAME')}"
)