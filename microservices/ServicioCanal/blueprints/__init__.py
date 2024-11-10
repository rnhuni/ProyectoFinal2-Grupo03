from importlib import import_module
import os
from .healthcheck.routes import healthcheck_bp

base_url = os.getenv("BASE_URL", "")

def register_blueprints(app):
    app.register_blueprint(healthcheck_bp, url_prefix='/')
    blueprints_dir = os.path.dirname(__file__)
    for module_name in os.listdir(blueprints_dir):
        if module_name == "healthcheck":
            continue
        module_path = os.path.join(blueprints_dir, module_name)
        if os.path.isdir(module_path) and not module_name.startswith('__'):
            routes_file = os.path.join(module_path, 'routes.py')
            if os.path.isfile(routes_file):
                module = import_module(f'{__name__}.{module_name}.routes')
                blueprint = getattr(module, f'{module_name}_bp', None)
                if blueprint:
                    print(f"{blueprint} {base_url}")
                    app.register_blueprint(blueprint, url_prefix=base_url)
