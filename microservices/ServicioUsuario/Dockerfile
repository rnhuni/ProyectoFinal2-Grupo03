FROM python:3.9-slim

WORKDIR /ServicioUsuario

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY app.py ./
COPY __init__.py ./
COPY blueprints/ ./blueprints/
COPY services/ ./services/
COPY utils/ ./utils/

RUN useradd -m appuser && chown -R appuser /ServicioUsuario
USER appuser

EXPOSE 5000

ENV FLASK_APP=app.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]