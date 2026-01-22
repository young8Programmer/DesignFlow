# Contributing to DesignFlow

Thank you for your interest in contributing to DesignFlow!

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. Set up environment variables (see `.env.example` files)
5. Start development servers:
   ```bash
   npm run dev
   ```

## Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Write/update tests if applicable
4. Ensure all tests pass
5. Submit a pull request with a clear description

## Project Structure

- `backend/` - NestJS backend API
- `frontend/` - Next.js frontend application
- Each module should be self-contained with its own entities, DTOs, services, and controllers
