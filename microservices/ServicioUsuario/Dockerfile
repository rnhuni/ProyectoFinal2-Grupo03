FROM python:3.9-slim

WORKDIR /ServicioUsuario

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . /ServicioUsuario

EXPOSE 5000

ENV FLASK_APP=app.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
