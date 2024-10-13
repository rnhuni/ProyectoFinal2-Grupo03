from flask import Flask
from blueprints import register_blueprints

app = Flask(__name__)

register_blueprints(app)

if __name__ == '__main__':
    print("ServicioSistema is running on 5000")

    app.run(host='0.0.0.0', port=5000)
