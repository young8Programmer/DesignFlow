# DesignFlow - Deployment Guide

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- PM2 (for production process management)

## Environment Setup

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=designflow

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=production

CLICK_MERCHANT_ID=your_click_merchant_id
CLICK_SERVICE_ID=your_click_service_id
CLICK_SECRET_KEY=your_click_secret_key

PAYME_MERCHANT_ID=your_payme_merchant_id
PAYME_SECRET_KEY=your_payme_secret_key
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=DesignFlow
```

## Installation Steps

### 1. Install Dependencies

```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create database
createdb designflow

# Run migrations (if you have them)
cd backend
npm run migration:run
```

### 3. Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

### 4. Production Start

#### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start dist/main.js --name designflow-backend

# Start frontend
cd ../frontend
pm2 start npm --name designflow-frontend -- start
```

#### Manual Start

```bash
# Backend
cd backend
npm run start:prod

# Frontend (in another terminal)
cd frontend
npm start
```

## Docker Deployment (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: designflow
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_DATABASE: designflow
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3001:3001"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Payment Integration

### Click Integration

1. Register at https://click.uz
2. Get merchant credentials
3. Add webhook endpoint: `POST /api/payments/click/webhook`

### Payme Integration

1. Register at https://payme.uz
2. Get merchant credentials
3. Add webhook endpoint: `POST /api/payments/payme/webhook`

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS in production
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Use environment variables for all secrets
- [ ] Enable PostgreSQL SSL connections

## Monitoring

- Set up error tracking (Sentry, etc.)
- Monitor API response times
- Set up database monitoring
- Configure log aggregation
