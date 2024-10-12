import os
from importlib import import_module

def register_blueprints(app):
    blueprints_dir = os.path.dirname(__file__)
    for module_name in os.listdir(blueprints_dir):
        module_path = os.path.join(blueprints_dir, module_name)
        if os.path.isdir(module_path) and not module_name.startswith('__'):
            routes_file = os.path.join(module_path, 'routes.py')
            if os.path.isfile(routes_file):
                module = import_module(f'blueprints.{module_name}.routes')
                blueprint = getattr(module, f'{module_name}_bp', None)
                if blueprint:
                    app.register_blueprint(blueprint)
