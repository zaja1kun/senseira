#!/bin/sh
SENSEIRA_HOST="senseira"
SENSEIRA_DB_HOST="senseira-db"
SENSEIRA_DB_PSWD="senseira"
SENSEIRA_DB_NAME="senseira"
SENSEIRA_ADMIN_NAME="admin"
SENSEIRA_ADMIN_MAIL="admin@example.com"
SENSEIRA_ADMIN_PSWD="admin"

docker stop "$SENSEIRA_HOST" "$SENSEIRA_DB_HOST" &>> /dev/null
docker rm "$SENSEIRA_HOST" "$SENSEIRA_DB_HOST" &>> /dev/null

docker run --name "$SENSEIRA_DB_HOST" -e MYSQL_ROOT_PASSWORD="$SENSEIRA_DB_PSWD" -d mysql:latest
sleep 30
docker exec "$SENSEIRA_DB_HOST" mysql --user='root' --password="$SENSEIRA_DB_PSWD" -e "create database $SENSEIRA_DB_NAME character set utf8"

docker build -t senseira:latest - < Dockerfile
docker run --name "$SENSEIRA_HOST" \
  --link "$SENSEIRA_DB_HOST":mysql \
  -e SENSEIRA_DB_NAME="$SENSEIRA_DB_NAME" \
  -e SENSEIRA_DB_PSWD="$SENSEIRA_DB_PSWD" \
  -e SENSEIRA_DB_HOST="$SENSEIRA_DB_HOST" \
  -e SENSEIRA_ADMIN_NAME="$SENSEIRA_ADMIN_NAME" \
  -e SENSEIRA_ADMIN_PSWD="$SENSEIRA_ADMIN_PSWD" \
  -e SENSEIRA_ADMIN_MAIL="$SENSEIRA_ADMIN_MAIL" \
  -p 0.0.0.0:8080:8080 \
  -d senseira:latest
