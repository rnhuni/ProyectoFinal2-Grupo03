import re
import unicodedata

def build_plan_id(name):
    slug = generate_slug(name)
    return f"plan-{slug}" if not slug.startswith("plan-") else slug

def build_role_id(name):
    slug = generate_slug(name)
    return f"role-{slug}" if not slug.startswith("role-") else slug

def build_permission_id(service, name):
    service_slug = generate_slug(service)
    name_slug = generate_slug(name)
    return f"pem-{service_slug}-{name_slug}" if not (service_slug.startswith("pem-") or name_slug.startswith("pem-")) else f"{service_slug}-{name_slug}"

def generate_slug(name):
    name = name.lower()
    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode('ascii')
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '-', name).strip('-')
    
    return name
