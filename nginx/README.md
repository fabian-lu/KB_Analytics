# Nginx

Reverse proxy that routes all traffic and handles HTTPS.

## Architecture

```
User → nginx:443 → /        → frontend (Vite dev server or static files)
                 → /api/*   → backend (FastAPI)
                 → /health  → backend health check
```

Single entry point for the entire application.

## Files

```
nginx/
├── nginx.dev.conf    # Development config (proxies to Vite)
├── certs/            # SSL certificates (gitignored)
│   ├── localhost+2.pem
│   └── localhost+2-key.pem
└── README.md
```

## Development Setup

### SSL Certificates

Generated with mkcert for local HTTPS:

```bash
# Install mkcert (one-time)
sudo apt install libnss3-tools
curl -L -o mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/

# Install local CA (one-time)
mkcert -install

# Generate certificates
cd nginx/certs
mkcert localhost 127.0.0.1 <your-local-ip>
```

### For Mobile Testing

Install the root CA on your phone:

1. Find CA: `mkcert -CAROOT`
2. Send `rootCA.pem` to phone
3. Install as CA certificate in phone settings

Then access `https://<your-local-ip>` on your phone.

## Configuration

### Development (`nginx.dev.conf`)

- HTTP redirects to HTTPS
- Proxies `/` to Vite dev server (port 5173)
- Proxies `/api/*` to FastAPI (port 8000)
- WebSocket support for Vite hot reload

### Production (`nginx.prod.conf`)

TODO: Will serve static files directly instead of proxying to Vite.

- Serve `frontend/dist/` for `/`
- Proxy `/api/*` to backend
- Use Let's Encrypt certificates

## Adding Routes

To proxy a new path to a service, add a location block:

```nginx
location /new-service/ {
    proxy_pass http://service-name:port;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
