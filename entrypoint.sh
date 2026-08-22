#!/bin/bash
set -e

echo "Aplicando as migrações..."
python manage.py migrate --noinput

echo "Criando admin..."
# O '|| true' evita que o script quebre se o admin já existir após um reinício
python manage.py createsuperuser --noinput || true

echo "Iniciando o Uvicorn..."
exec uvicorn config.asgi:application --host 0.0.0.0 --port 8000