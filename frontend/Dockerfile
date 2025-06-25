# Frontend Dockerfile (frontend/Dockerfile)
# Build stage
FROM node:18-alpine AS build
 
WORKDIR /app
 
# Copy package files
COPY package*.json ./
 
# Install dependencies
RUN npm ci
 
# Copy source code
COPY . .
 
# Build the application
RUN npm run build
 
# Production stage
FROM nginx:alpine
 
# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html/eeinet
 
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
# Add non-root user
RUN addgroup -g 1001 -S nginx_user
RUN adduser -S nginx_user -u 1001
 
# Change ownership
RUN chown -R nginx_user:nginx_user /usr/share/nginx/html
RUN chown -R nginx_user:nginx_user /var/cache/nginx
 
# Expose port
EXPOSE 8080
 
# Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
 
# Start nginx
CMD ["nginx", "-g", "daemon off;"]