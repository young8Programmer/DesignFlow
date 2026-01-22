# DesignFlow - Professional Online Graphic Editor

DesignFlow is a SaaS platform for creating professional graphics, similar to Canva, Crello, and VistaCreate. Users can create resumes, business cards, Instagram posts, invitations, menus, and more using drag-and-drop templates.

## 🚀 Features

- **Drag-and-Drop Editor**: Intuitive canvas-based editor with Fabric.js
- **Template Library**: Pre-designed templates for various categories
- **Layers System**: Photoshop-like layer management
- **Export Options**: High-quality PDF and PNG exports
- **Wallet & Payments**: Integrated payment system (Click/Payme)
- **Freemium Model**: Free basic features, premium templates and assets

## 💰 Monetization

- **Freemium**: Basic elements free, premium templates/assets paid
- **Pay-per-Download**: Charge for high-quality exports
- **Monthly Subscription**: Unlimited access with subscription

## 🛠 Tech Stack

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: Next.js 14 + Fabric.js + React
- **Export Engine**: Puppeteer/Canvas for PDF/Image generation

## 📁 Project Structure

```
DesignFlow/
├── backend/          # NestJS backend
├── frontend/         # Next.js frontend
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm 9+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Set up environment variables (see `.env.example` files)

4. Run database migrations:
   ```bash
   cd backend
   npm run migration:run
   ```

5. Start development servers:
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:3000`
Frontend will run on `http://localhost:3001`

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started in 5 minutes
- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed architecture
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

## 🎯 Key Features Implemented

✅ User authentication and authorization  
✅ Drag-and-drop canvas editor with Fabric.js  
✅ Design storage (JSON-based persistence)  
✅ Template library with categories  
✅ Layers system (Photoshop-like)  
✅ Properties panel for object editing  
✅ Export to PDF and PNG  
✅ Wallet system  
✅ Payment integration structure  
✅ Subscription management  
✅ Premium/freemium access control  

## 🔄 Next Steps for Full Production

1. **Payment Integration**: Implement Click/Payme webhooks
2. **File Upload**: Add image upload to server
3. **Thumbnail Generation**: Auto-generate design thumbnails
4. **Email Verification**: Add email verification flow
5. **Password Reset**: Implement password reset functionality
6. **Admin Panel**: Create admin dashboard for template/asset management
7. **Analytics**: Add usage analytics
8. **Caching**: Implement Redis for performance
9. **CDN**: Set up CDN for assets
10. **Testing**: Add unit and e2e tests

## 📝 License

Proprietary - All rights reserved
