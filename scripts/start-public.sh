#!/usr/bin/env bash
set -euo pipefail

APP_IMAGE="${APP_IMAGE:-personal-site}"
APP_CONTAINER="${APP_CONTAINER:-personal-site-public}"
PORT="${PORT:-3000}"
DATABASE_URL="${DATABASE_URL:-postgres://personal_site:personal_site@db:5432/personal_site}"
PAYLOAD_SECRET="${PAYLOAD_SECRET:-local-payload-secret-change-me}"

cd "$(dirname "$0")/.."

mkdir -p public/media

echo "Starting database..."
docker compose up -d db

echo "Preparing database schema and seed data..."
docker compose run --rm app pnpm cms:bootstrap

echo "Building production image..."
docker build --target runner -t "$APP_IMAGE" .

if docker container inspect "$APP_CONTAINER" >/dev/null 2>&1; then
  echo "Stopping existing $APP_CONTAINER container..."
  docker stop "$APP_CONTAINER" >/dev/null
  docker rm "$APP_CONTAINER" >/dev/null
fi

echo "Starting production site on 0.0.0.0:$PORT..."
docker run -d \
  --name "$APP_CONTAINER" \
  --network personal-site_default \
  -p "$PORT:3000" \
  -e DATABASE_URL="$DATABASE_URL" \
  -e NEXT_TELEMETRY_DISABLED=1 \
  -e PAYLOAD_SECRET="$PAYLOAD_SECRET" \
  -v "$(pwd)/public/media:/app/public/media" \
  "$APP_IMAGE"

echo "Site is running: http://localhost:$PORT"
echo "Stop it with: docker stop $APP_CONTAINER"
