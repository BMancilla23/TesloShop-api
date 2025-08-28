# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a NestJS e-commerce backend application called "Teslo Shop" that provides REST API endpoints for an online store. It uses PostgreSQL as the database, implements JWT authentication with role-based authorization, and includes comprehensive Swagger API documentation.

## Essential Commands

### Environment Setup
```bash
# Copy environment template and configure variables
cp .env.template .env

# Install dependencies
pnpm install

# Start PostgreSQL database
docker compose up -d

# Check database status
docker compose ps

# View database logs
docker compose logs -f db
```

### Development
```bash
# Start development server with hot reload
pnpm run start:dev

# Start in debug mode
pnpm run start:debug

# Build for production
pnpm run build

# Start production server
pnpm run start:prod
```

### Testing
```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov

# Run e2e tests
pnpm run test:e2e

# Debug tests
pnpm run test:debug
```

### Code Quality
```bash
# Lint and fix code
pnpm run lint

# Format code
pnpm run format
```

### Database Operations
```bash
# Seed database with sample data
# Navigate to: http://localhost:3000/api/seed

# Stop database
docker compose down
```

## Architecture Overview

### Core Structure
- **Modular Architecture**: Built using NestJS modules with clear separation of concerns
- **Domain-Driven Design**: Each business domain (products, auth, files) has its own module
- **Global Configuration**: Centralized environment configuration and validation pipes
- **JWT Authentication**: Role-based access control with Passport strategy

### Key Modules

#### Products Module (`src/products/`)
- Manages product catalog with full CRUD operations
- Supports product images through separate entity relationship
- Implements slug generation with TypeORM hooks
- Uses TypeORM relations for complex data relationships

#### Authentication Module (`src/auth/`)
- JWT-based authentication with configurable expiration
- Role-based authorization (USER/ADMIN roles)
- Password hashing with Argon2
- Custom decorators for route protection and user extraction

#### Files Module (`src/files/`)
- File upload handling with validation
- Static file serving configuration
- Custom file naming and filtering helpers

#### Common Module (`src/common/`)
- Shared DTOs (pagination, etc.)
- Global exception filters for database and HTTP errors
- Error handling utilities

### Database Design
- **PostgreSQL** with TypeORM for ORM functionality
- **Entity Relationships**: 
  - User ↔ Products (One-to-Many)
  - Product ↔ ProductImages (One-to-Many)
- **Auto-generated UUIDs** for primary keys
- **Database synchronization** enabled for development (set `synchronize: false` in production)

### API Documentation
- **Swagger/OpenAPI** integration at `/api` endpoint
- Comprehensive API documentation with examples
- Bearer token authentication support
- DTO validation with class-validator decorators

## Development Patterns

### Authentication Flow
- Uses JWT tokens with configurable secret
- Guards implement role-based access control
- Custom decorators (`@Auth()`, `@GetUser()`) simplify route protection
- Password validation and hashing handled by Argon2

### Data Validation
- Global ValidationPipe configured with whitelist and forbidden non-whitelisted properties
- Class-validator decorators on DTOs
- Transform and validation happens automatically

### Error Handling
- Custom exception filters for database and HTTP errors
- Global exception handling with structured error responses
- Database constraint violation handling

### File Uploads
- Multer configuration for file handling
- Custom file naming and validation helpers
- Static file serving for uploaded images

## Environment Variables

Required environment variables (see `.env.template`):
- `PORT` - Application port
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` - PostgreSQL connection
- `HOST_API` - API host URL
- `JWT_SECRET` - JWT signing secret (generate with: `openssl rand -hex 32`)

## Key Development Notes

### TypeORM Patterns
- Uses `@BeforeInsert()` and `@BeforeUpdate()` hooks for data transformation
- Implements eager loading for related entities where appropriate
- Uses `Relation<T>` type for better TypeScript support with relationships

### Swagger Integration
- Comprehensive API documentation with `@ApiProperty()` decorators
- Bearer authentication configured for protected routes
- DTO examples provided for all endpoints

### Module Architecture
- Each module exports services and repositories for cross-module usage
- Auth module exports JWT strategy and Passport module for reuse
- TypeORM feature modules registered per domain

### Security Considerations
- CORS enabled with configurable origins
- JWT tokens with reasonable expiration times
- Password fields excluded from default selections
- Role-based access control implemented throughout

## API Endpoints

Once running, access:
- **API Documentation**: http://localhost:3000/api
- **Seed Database**: http://localhost:3000/api/seed
- **Health Check**: http://localhost:3000/api (redirects to Swagger)
