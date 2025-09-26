#!/bin/sh

echo "Aguardando o banco de dados estar pronto..."

until pg_isready -h postgres -p 5432 -U user_admin; do
  echo "PostgreSQL ainda não está pronto... aguardando"
  sleep 2
done

echo "PostgreSQL está pronto! Executando migrations..."

node ace migration:run --force

echo "Migrations executadas com sucesso! Iniciando aplicação..."

exec "$@"
