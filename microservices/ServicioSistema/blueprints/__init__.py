from importlib import import_module
import os

base_url = os.getenv("BASE_URL", "")

def register_blueprints(app):
    blueprints_dir = os.path.dirname(__file__)
    for module_name in os.listdir(blueprints_dir):
        module_path = os.path.join(blueprints_dir, module_name)
        if os.path.isdir(module_path) and not module_name.startswith('__'):
            routes_file = os.path.join(module_path, 'routes.py')
            if os.path.isfile(routes_file):
                # Cambiar a importación absoluta
                module = import_module(f'{__name__}.{module_name}.routes')
                blueprint = getattr(module, f'{module_name}_bp', None)
                if blueprint:
                    app.register_blueprint(blueprint, url_prefix=base_url)
