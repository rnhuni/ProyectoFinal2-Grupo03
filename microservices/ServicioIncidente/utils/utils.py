import jwt
import datetime

def build_incident_id():
    current_time = datetime.datetime.now()
    date_str = current_time.strftime("%y%m%d")
    time_str = current_time.strftime("%H%M%S") + f"{current_time.microsecond // 1000:03d}"
    return f"TKT-{date_str}-{time_str}"

def decode_user(auth_header):
    if not auth_header or len(auth_header.split(" ")) < 2:
        raise Exception("Invalid token")
    token = auth_header.split(" ")[1].strip()
    parts = token.split(".")
    if len(parts) < 3:
        raise Exception("Invalid token")
    token = ".".join(parts[:3])

    token_payload = jwt.decode(token, options={"verify_signature": False})
    return {
        "id": token_payload["sub"], 
        "name": token_payload["name"], 
        "email": token_payload["email"]
    }