FROM arm64v8/python:3.9-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "-u", "app.py"]
