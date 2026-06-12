#!/bin/bash
# ============================================================
# Emergent preview launcher — serves the PHP store on port 3000
# (replaces the React dev server; supervisor runs this via `yarn start`)
# Self-healing: starts MariaDB if needed and seeds the database
# on a fresh pod. NOT needed on normal PHP hosting (cPanel etc.)
# ============================================================
set -e

# 1) Ensure MariaDB is running
if ! mysqladmin ping --silent 2>/dev/null; then
  mkdir -p /run/mysqld
  chown mysql:mysql /run/mysqld 2>/dev/null || true
  (mysqld_safe --skip-grant-tables=0 >/dev/null 2>&1 &)
  for i in $(seq 1 30); do
    mysqladmin ping --silent 2>/dev/null && break
    sleep 1
  done
fi

# 2) Seed the database if missing (fresh pod)
if ! mysql -uroot -e "USE ucode_store" 2>/dev/null; then
  mysql -uroot -e "CREATE DATABASE IF NOT EXISTS ucode_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
  mysql -uroot ucode_store < /app/php-version/database.sql
  echo "[start.sh] Database ucode_store created and seeded"
fi

# 3) Export integration keys from the backend .env (preview convenience)
ENVF=/app/backend/.env
if [ -f "$ENVF" ]; then
  for K in STRIPE_API_KEY EMERGENT_LLM_KEY RESEND_API_KEY SENDER_EMAIL; do
    V=$(grep "^${K}=" "$ENVF" | head -1 | cut -d'=' -f2- | sed 's/^"//; s/"$//')
    [ -n "$V" ] && export "$K=$V"
  done
fi

# 4) Serve the PHP store on port 3000
exec env PHP_CLI_SERVER_WORKERS=8 php -S 0.0.0.0:3000 -t /app/php-version /app/php-version/router.php
