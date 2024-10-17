import re
import unicodedata

def build_role_id(name):
    return generate_slug(name)

def build_permission_id(service, name):
    return f"{generate_slug(service)}-{generate_slug(name)}"

def generate_slug(name):
    name = name.lower()
    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode('ascii')
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '-', name).strip('-')
    
    return name
