# DesignFlow - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb designflow

# Or using psql
psql -U postgres
CREATE DATABASE designflow;
\q
```

### 3. Configure Environment

#### Backend (.env)
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

#### Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local if needed
```

### 4. Start Development Servers

```bash
# From root directory
npm run dev
```

This will start:
- Backend: http://localhost:3000
- Frontend: http://localhost:3001

### 5. Create Your First Account

1. Go to http://localhost:3001
2. Click "Sign up"
3. Create an account
4. Start creating designs!

## 📝 First Steps

1. **Create a Design**: Click "Create New Design" on dashboard
2. **Add Elements**: Use toolbar to add text, shapes, images
3. **Edit Properties**: Select an object and use properties panel
4. **Manage Layers**: Use layers panel to organize objects
5. **Save**: Click save button to store your design
6. **Export**: Use download button to export as PNG

## 🎨 Using Templates

1. Go to `/templates` page
2. Browse templates by category
3. Click "Use Template" to create a design from template
4. Edit and customize as needed

## 💰 Testing Payments

### Wallet Top-up
1. Go to wallet page (to be implemented)
2. Enter amount
3. Choose payment provider (Click/Payme)
4. Complete payment

### Export Payment
- Non-subscribers are charged 500 UZS per export
- Subscribers get unlimited free exports

## 🔧 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Ensure database exists: `psql -l | grep designflow`

### Port Already in Use
- Change ports in `package.json` scripts
- Or kill process: `lsof -ti:3000 | xargs kill`

### Module Not Found
- Delete `node_modules` and reinstall
- Clear npm cache: `npm cache clean --force`

## 📚 Next Steps

- Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for architecture details
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Check [README.md](./README.md) for full documentation

## 🆘 Need Help?

- Check existing issues
- Review code comments
- Read NestJS and Next.js documentation
