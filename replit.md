# Overview

This is a comprehensive web-based unit conversion application that enables conversions between three measurement systems: SI (International System), US Customary, and Seximal (a unique base-6 notation system). The application provides real-time bidirectional conversion across multiple dimensions including length, mass, area, volume, temperature, pressure, time, speed, acceleration, force, energy, frequency, and power. It features an intuitive card-based interface with dimension tabs and tap-to-change unit selection, inspired by iPhone's Convertible app design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Design System
- **Component Library**: Comprehensive shadcn/ui implementation with 40+ pre-built components
- **Theme System**: CSS custom properties for light/dark mode support
- **Typography**: Inter font family for clean, modern appearance
- **Color Palette**: iOS-inspired colors (primary blue #007AFF, secondary green #34C759, accent orange #FF9500)
- **Layout**: Card-based design with 20px padding, 12px border radius, mobile-first responsive approach

## Core Conversion Engine
- **Multi-System Support**: Three measurement systems with standardized conversion factors
- **Seximal Number System**: Custom base-6 implementation with prefixes (unse-, duse-, trise-, etc.)
- **Real-time Conversion**: Bidirectional conversion with any field as input/output
- **Dimension Support**: 13 different measurement dimensions with appropriate units
- **Precision Handling**: Intelligent number formatting and validation

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **API Structure**: RESTful endpoints with /api prefix
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement with Vite integration

## Data Layer
- **ORM**: Drizzle with PostgreSQL dialect for schema management
- **Schema Definition**: Type-safe database schemas with Zod validation
- **Migration System**: Drizzle Kit for database migrations
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations

## External Dependencies

- **Database**: Neon PostgreSQL serverless database
- **UI Components**: Radix UI primitives for accessible component foundation
- **Validation**: Zod for runtime type checking and schema validation
- **Date Handling**: date-fns for date manipulation utilities
- **Development Tools**: Replit-specific plugins for development environment integration
- **Build System**: esbuild for server bundling, Vite for client bundling