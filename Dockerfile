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
# Define variáveis temporárias apenas para o momento do build
ARG SECRET_KEY="dummy"
ARG DEBUG="False"
ARG POSTGRES_DB="dummy"
ARG POSTGRES_USER="dummy"
ARG POSTGRES_PASSWORD="dummy"
ARG POSTGRES_HOST="localhost"
ARG POSTGRES_PORT="5432"
ARG COOKIE_SECRET="dummy"
ARG CSRF_SECRET="dummy"

# Roda o comando usando as variáveis acima
RUN python manage.py collectstatic --noinput
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]