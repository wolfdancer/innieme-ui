#!/bin/bash
# SSL/Nginx Setup Script for innieme.ai

# Update system
sudo dnf update -y

# Install Nginx and Certbot
sudo dnf install -y nginx
sudo dnf install -y certbot python3-certbot-nginx

# Create Nginx config
cat > /tmp/docker-app.conf << 'EOF'
# HTTPS server block
server {
    server_name innieme.ai www.innieme.ai;
    listen 443 ssl;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
	# Add request body buffering
	client_body_buffer_size 16k;
	# Force reading the request body before proxying
	proxy_pass_request_body on;
    
	# Log to separate file with our custom format
	access_log /var/log/nginx/api_access.log api_log;

	# Add a proxy request interceptor
	proxy_set_header X-Save-Request-Body "true";
    
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP to HTTPS redirect server block
server {
    server_name innieme.ai www.innieme.ai;
    listen 80;
    
    # Simple redirect to HTTPS
    return 301 https://$host$request_uri;
}

EOF

# Move config to Nginx directory
sudo mv /tmp/docker-app.conf /etc/nginx/conf.d/

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Get SSL cert
sudo certbot --nginx -d innieme.ai -d www.innieme.ai --non-interactive --agree-tos --email your-email@example.com

# Reload Nginx
sudo systemctl reload nginx

# Start Docker containers
cd /path/to/your/project
docker-compose -f docker-compose.debug.yml up -d