FROM python:3.14-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Atualiza os pacotes e instala dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/staticfiles
RUN mkdir -p /app/media
RUN SECRET_KEY="dummy" DEBUG="False" POSTGRES_DB="dummy" POSTGRES_USER="dummy" POSTGRES_PASSWORD="dummy" POSTGRES_HOST="localhost" POSTGRES_PORT="5432" COOKIE_SECRET="dummy" CSRF_SECRET="dummy" python manage.py collectstatic --noinput

RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]