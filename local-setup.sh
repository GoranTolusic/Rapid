#!/bin/bash

IMAGE_NAME="rapid"
CONTAINER_NAME="rapid"
POSTGRE='postgreDB'
EMQX='emqx'

function is_port_in_use() {
    local port=$1
    if sudo netstat -tuln | grep -q ":$port"; then
        echo "Port $port is already in use."
        exit 1
    fi
}

# Source environment variables from .env file
if [ -f .env ]; then
    source .env
else
    echo ".env file not found. Make sure it exists in the same directory as the script. Look for .env.examples"
    exit 1
fi

# Check if required ports are in use
is_port_in_use $DB_PORT
is_port_in_use $PORT
is_port_in_use $MQTT_PORT

#Pull postgre image if does not exists
if ! docker images | grep -q postgres; then
    docker pull postgres
fi

# Pull emqx image if does not exists
if ! docker images | grep -q emqx; then
    docker pull emqx/emqx
fi

# Run postgre database
docker run --name $POSTGRE -e POSTGRES_PASSWORD=$DB_PASSWORD -v ~/postgres-data:/var/lib/postgresql/data -p $DB_PORT:$DB_PORT -d postgres

# Run mqtt broker
docker run -d --name $EMQX -p $MQTT_PORT:$MQTT_PORT -p 8081:8081 -p 18083:18083 emqx/emqx

# Take some time for db and emqx to run properly 
sleep 3

# Check if postgre and emqx containers are running properly
if [ "$(docker ps -q -f name=$POSTGRE)" ]; then
    echo "Postgre is running."
else
    echo "Failed to start postgre."
    exit 1
fi

if [ "$(docker ps -q -f name=$EMQX)" ]; then
    echo "Emqx is running."
else
    echo "Failed to start emqx."
    exit 1
fi

# Remove previous application container if exists
docker rm -f $CONTAINER_NAME >/dev/null 2>&1

# Remove previous image if exists
if [ "$(docker images -q $IMAGE_NAME 2>/dev/null)" ]; then
    docker rmi $IMAGE_NAME >/dev/null
    echo "Removed all old '$IMAGE_NAME' images."
fi

# Build Docker image
# This could be better to run with exposed ports only, but for now stays with network flag
docker build -t $IMAGE_NAME --network=host .

# Run Docker container
# This could be better to run with exposed ports only, but for now stays with network flag
docker run --name $CONTAINER_NAME -d --network=host $IMAGE_NAME

# Check if container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Application is running."
    docker logs -f $(docker ps | grep $CONTAINER_NAME | awk '{print$1}')
else
    echo "Failed to start application."
fi