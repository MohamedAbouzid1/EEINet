#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting EEINet deployment..."

# Configuration
PROJECT_NAME="eeinet"
BACKUP_DIR="./backups"
LOG_FILE="./deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Determine which docker compose command to use
get_docker_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    elif docker compose version &> /dev/null; then
        echo "docker compose"
    else
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
}
DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    log "✅ Docker and Docker Compose are available"
}

# Check environment file
check_environment() {
    if [ ! -f ".env.production" ]; then
        error "❌ .env.production file not found. Please create it with your configuration."
    fi
    
    # Copy to .env for Docker Compose
    cp .env.production .env
    log "✅ Environment configuration loaded"
}

# Create necessary directories
setup_directories() {
    mkdir -p "$BACKUP_DIR"
    mkdir -p "./logs"
    mkdir -p "./ssl"  # For SSL certificates
    log "✅ Directories created"
}

# Backup existing data (if any)
backup_data() {
    if docker volume ls | grep -q "${PROJECT_NAME}_postgres_data"; then
        log "📦 Creating database backup..."
        BACKUP_FILE="$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql"
        
        # Create backup
        docker exec -t eeinet-db pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null || warn "Could not create database backup"
        
        if [ -f "$BACKUP_FILE" ]; then
            log "✅ Database backup created: $BACKUP_FILE"
        fi
    fi
}

# Build and deploy
deploy() {
    log "🔨 Building and starting containers..."
    
    # Stop existing containers
    ${DOCKER_COMPOSE_CMD} down --remove-orphans 2>/dev/null || true
    
    # Pull latest images
    ${DOCKER_COMPOSE_CMD} pull
    
    # Build and start services
    ${DOCKER_COMPOSE_CMD} up -d --build
    
    log "✅ Containers started"
}

# Wait for services to be healthy
wait_for_services() {
    log "⏳ Waiting for services to be healthy..."
    
    # Wait for database
    for i in {1..30}; do
        if docker-compose exec -T database pg_isready -U "$DB_USER" -d "$DB_NAME" &>/dev/null; then
            log "✅ Database is ready"
            break
        fi
        sleep 2
    done
    
    # Wait for backend
    for i in {1..30}; do
        if curl -f http://localhost:5000/health &>/dev/null; then
            log "✅ Backend is ready"
            break
        fi
        sleep 2
    done
    
    # Wait for frontend
    for i in {1..30}; do
        if curl -f http://localhost:8221/ &>/dev/null; then
            log "✅ Frontend is ready"
            break
        fi
        sleep 2
    done
}

# Show status
show_status() {
    log "📊 Deployment Status:"
    ${DOCKER_COMPOSE_CMD} ps
    
    echo ""
    log "🌐 Application URLs:"
    echo "   Frontend: http://localhost:8221"
    echo "   Backend API: http://localhost:5000"
    echo "   Health Check: http://localhost:5000/health"
    echo "   Public URL: https://prototypes.cosy.bio/eeinet"
    log "📝 Logs can be viewed with:"
    echo "   ${DOCKER_COMPOSE_CMD} logs -f [service_name]"
    echo ""
    log "🛠  Management commands:"
    echo "   Stop: ${DOCKER_COMPOSE_CMD} down"
    echo "   Restart: ${DOCKER_COMPOSE_CMD} restart"
    echo "   Update: ${DOCKER_COMPOSE_CMD} pull && ${DOCKER_COMPOSE_CMD} up -d"
}

# Cleanup function
cleanup() {
    rm -f .env  # Remove temporary .env file
}

# Set trap for cleanup
trap cleanup EXIT

# Main deployment process
main() {
    log "🚀 Starting EEINet deployment process..."
    
    check_docker
    check_environment
    setup_directories
    backup_data
    deploy
    wait_for_services
    show_status
    
    log "🎉 Deployment completed successfully!"
    log "💡 Check the logs if you encounter any issues: tail -f $LOG_FILE"
}

# Parse command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        log "🛑 Stopping EEINet services..."
        ${DOCKER_COMPOSE_CMD} down
        log "✅ Services stopped"
        ;;
    "restart")
        log "🔄 Restarting EEINet services..."
        ${DOCKER_COMPOSE_CMD} restart
        log "✅ Services restarted"
        ;;
    "logs")
        ${DOCKER_COMPOSE_CMD} logs -f
        ;;
    "status")
        ${DOCKER_COMPOSE_CMD} ps
        ;;
    "backup")
        backup_data
        ;;
    *)
        echo "Usage: $0 {deploy|stop|restart|logs|status|backup}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy the application (default)"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - Show logs from all services"
        echo "  status  - Show status of all services"
        echo "  backup  - Create database backup"
        exit 1
        ;;
esac
