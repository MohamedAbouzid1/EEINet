#!/bin/bash

echo "Starting EEINet API Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo ".env file not found. Please create one"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the server
if [ "$NODE_ENV" = "production" ]; then
    echo "Starting in production mode..."
    npm start
else
    echo "Starting in development mode..."
    npm run dev
fi