# DesignFlow - Project Structure

## Overview

DesignFlow is a full-stack SaaS application for creating professional graphics online. The project is structured as a monorepo with separate backend and frontend applications.

## Architecture

```
DesignFlow/
├── backend/              # NestJS Backend API
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── users/        # User management
│   │   ├── designs/      # Design CRUD operations
│   │   ├── templates/    # Template library
│   │   ├── payments/     # Payment processing
│   │   ├── wallet/       # User wallet management
│   │   ├── subscription/ # Subscription management
│   │   ├── exports/      # PDF/PNG export engine
│   │   ├── assets/       # Asset library (icons, fonts, etc.)
│   │   └── config/       # Configuration files
│   └── package.json
│
├── frontend/             # Next.js Frontend
│   ├── app/              # Next.js App Router
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # User dashboard
│   │   ├── editor/       # Canvas editor pages
│   │   └── templates/   # Template gallery
│   ├── components/       # React components
│   │   └── Editor/       # Editor components
│   ├── store/            # Zustand state management
│   ├── lib/              # Utility functions
│   └── package.json
│
└── package.json          # Root package.json
```

## Backend Modules

### 1. Auth Module (`backend/src/auth/`)
- **Purpose**: User authentication and authorization
- **Features**:
  - JWT-based authentication
  - Registration and login
  - Password hashing with bcrypt
- **Endpoints**:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login

### 2. Users Module (`backend/src/users/`)
- **Purpose**: User profile management
- **Features**:
  - User CRUD operations
  - Profile updates
- **Endpoints**:
  - `GET /api/users/profile` - Get user profile
  - `PUT /api/users/profile` - Update user profile

### 3. Designs Module (`backend/src/designs/`)
- **Purpose**: Design storage and management
- **Features**:
  - Store designs as JSON (Fabric.js format)
  - Design CRUD operations
  - Design duplication
- **Endpoints**:
  - `GET /api/designs` - List user designs
  - `POST /api/designs` - Create new design
  - `GET /api/designs/:id` - Get design
  - `PATCH /api/designs/:id` - Update design
  - `DELETE /api/designs/:id` - Delete design
  - `POST /api/designs/:id/duplicate` - Duplicate design

### 4. Templates Module (`backend/src/templates/`)
- **Purpose**: Template library management
- **Features**:
  - Template categories (resume, business card, etc.)
  - Premium/free template filtering
  - Template access control
- **Endpoints**:
  - `GET /api/templates` - List templates (with category filter)
  - `GET /api/templates/:id` - Get template details
  - `POST /api/templates` - Create template (admin)

### 5. Payments Module (`backend/src/payments/`)
- **Purpose**: Payment processing
- **Features**:
  - Wallet top-up
  - Pay-per-download
  - Payment status tracking
- **Endpoints**:
  - `POST /api/payments/topup` - Top up wallet
  - `POST /api/payments/export` - Pay for export
  - `GET /api/payments/:id` - Get payment details

### 6. Wallet Module (`backend/src/wallet/`)
- **Purpose**: User wallet management
- **Features**:
  - Balance tracking
  - Add/deduct balance
- **Endpoints**:
  - `GET /api/wallet/balance` - Get wallet balance

### 7. Subscription Module (`backend/src/subscription/`)
- **Purpose**: Subscription management
- **Features**:
  - Monthly/yearly subscriptions
  - Active subscription checking
  - Subscription cancellation
- **Endpoints**:
  - `GET /api/subscription/status` - Get subscription status
  - `DELETE /api/subscription` - Cancel subscription

### 8. Exports Module (`backend/src/exports/`)
- **Purpose**: Design export functionality
- **Features**:
  - Export to PDF (using Puppeteer)
  - Export to PNG (using Canvas)
  - Automatic payment deduction for non-subscribers
- **Endpoints**:
  - `GET /api/exports/pdf/:designId` - Export as PDF
  - `GET /api/exports/png/:designId` - Export as PNG

### 9. Assets Module (`backend/src/assets/`)
- **Purpose**: Asset library (icons, fonts, shapes)
- **Features**:
  - Asset categorization
  - Premium asset filtering
- **Endpoints**:
  - `GET /api/assets` - List assets (with type filter)

## Frontend Structure

### 1. Pages (`frontend/app/`)

#### Authentication Pages
- `/auth/login` - Login page
- `/auth/register` - Registration page

#### Dashboard
- `/dashboard` - User dashboard with design list

#### Editor
- `/editor` - Create new design
- `/editor/[id]` - Edit existing design

#### Templates
- `/templates` - Template gallery

### 2. Components (`frontend/components/`)

#### Editor Components
- `CanvasEditor.tsx` - Main Fabric.js canvas component
- `Toolbar.tsx` - Toolbar with add/delete buttons
- `PropertiesPanel.tsx` - Object properties editor
- `LayersPanel.tsx` - Layer management panel

### 3. State Management (`frontend/store/`)

- `authStore.ts` - Authentication state (Zustand)
- `canvasStore.ts` - Canvas state management

## Data Flow

### Design Creation Flow

1. User creates design in editor
2. Canvas data (Fabric.js JSON) is stored in state
3. On save, data is sent to `POST /api/designs`
4. Backend stores JSON in PostgreSQL (JSONB column)
5. Design can be loaded later and edited

### Export Flow

1. User clicks export button
2. Frontend calls `GET /api/exports/pdf/:id` or `GET /api/exports/png/:id`
3. Backend checks subscription status
4. If no subscription, deducts from wallet
5. Backend converts JSON to PDF/PNG
6. File is returned to user

### Payment Flow

1. User tops up wallet via Click/Payme
2. Payment webhook updates payment status
3. On successful payment, wallet balance is updated
4. User can use balance for exports/premium content

## Database Schema

### Users
- id (UUID)
- email (unique)
- password (hashed)
- firstName, lastName
- role (user/admin)

### Designs
- id (UUID)
- name, description
- canvasData (JSONB) - Fabric.js JSON
- width, height
- userId (FK)
- templateId (FK, nullable)

### Templates
- id (UUID)
- name, description
- canvasData (JSONB)
- category (enum)
- isPremium (boolean)

### Payments
- id (UUID)
- userId (FK)
- amount
- type (wallet_topup, export_download, etc.)
- status (pending, completed, failed)
- provider (click, payme, wallet)

### Wallet
- id (UUID)
- userId (FK, unique)
- balance (decimal)

### Subscriptions
- id (UUID)
- userId (FK)
- plan (monthly, yearly)
- status (active, cancelled, expired)
- startDate, endDate

## Key Technologies

### Backend
- **NestJS**: Framework
- **TypeORM**: ORM
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Puppeteer**: PDF generation
- **Canvas**: Image generation

### Frontend
- **Next.js 14**: React framework
- **Fabric.js**: Canvas manipulation
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Axios**: HTTP client

## Security Features

1. **Authentication**: JWT tokens
2. **Authorization**: Role-based access control
3. **Password Hashing**: bcrypt
4. **CORS**: Configured for frontend domain
5. **Input Validation**: class-validator DTOs
6. **SQL Injection Protection**: TypeORM parameterized queries

## Monetization Strategy

1. **Freemium**: Basic features free, premium templates/assets paid
2. **Pay-per-Download**: Charge for high-quality exports (500 UZS)
3. **Subscription**: Monthly/yearly plans for unlimited access

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Version history
- [ ] More export formats (SVG, JPG)
- [ ] Advanced filters and effects
- [ ] Mobile app
- [ ] AI-powered design suggestions
- [ ] Brand kit management
- [ ] Team workspaces
