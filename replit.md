# FRA Atlas Full-Stack System

## Overview

The FRA Atlas is an AI-powered Forest Rights Act (FRA) implementation monitoring system with WebGIS-based Decision Support capabilities. The application focuses on integrated monitoring across four key Indian states: Madhya Pradesh, Tripura, Odisha, and Telangana. The system combines a React frontend with an Express.js backend to provide comprehensive claim management, geospatial visualization, and administrative oversight for FRA implementation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool for fast development and hot module replacement
- **State Management**: Redux Toolkit for centralized application state management
- **Routing**: React Router v7 for client-side navigation and route management
- **Styling**: TailwindCSS for utility-first responsive design with custom component styling
- **UI Components**: Lucide React for consistent iconography and custom components for complex interfaces
- **Animation**: Framer Motion for smooth transitions and interactive animations
- **Mapping**: Leaflet with React-Leaflet for interactive geospatial visualization and polygon drawing capabilities
- **Charts**: Recharts for data visualization and dashboard analytics
- **Forms**: React Hook Form for efficient form handling with validation

### Backend Architecture
- **Framework**: Express.js for RESTful API development
- **Database**: SQLite with better-sqlite3 for development, designed to migrate to PostgreSQL with PostGIS for production
- **Authentication**: JWT-based authentication with bcryptjs for password hashing
- **Security**: Helmet for security headers and CORS for cross-origin resource sharing
- **API Structure**: Modular routing with separate endpoints for auth, claims, alerts, reports, and user management

### Data Management
- **Frontend State**: Redux store with slices for authentication, claims, alerts, reports, and user data
- **API Services**: Axios-based service classes (AuthService, ClaimService) with automatic token injection
- **Database Schema**: Relational structure with users, claims, alerts, and reports tables
- **File Handling**: React Dropzone for document uploads with planned integration for claim documentation

### Authentication & Authorization
- **JWT Tokens**: Stored in localStorage with automatic inclusion in API requests
- **Role-based Access**: User roles (user, admin) with corresponding permissions
- **Protected Routes**: Authentication middleware for secure API endpoints
- **Session Management**: Token-based sessions with automatic logout on token expiration

### Geospatial Features
- **Interactive Maps**: Leaflet integration with drawing tools for claim boundary definition
- **Layer Management**: Support for satellite imagery, administrative boundaries, and custom overlays
- **Coordinate Systems**: Designed for integration with PostGIS for advanced geospatial operations
- **Data Visualization**: Map-based claim status visualization and geographical analytics

### Development & Deployment
- **Development Server**: Vite dev server on port 5000 with HMR disabled for Replit compatibility
- **Production Build**: Optimized Vite build with proper asset handling
- **Environment Configuration**: Flexible API endpoint configuration for development and production environments
- **Code Quality**: ESLint configuration with React-specific rules and automated formatting

## External Dependencies

### Core Technologies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js 5**: Backend web framework for Node.js
- **SQLite/better-sqlite3**: Development database with synchronous operations
- **TailwindCSS 3**: Utility-first CSS framework for responsive design

### Mapping & Geospatial
- **Leaflet 1.9**: Open-source mapping library for interactive maps
- **React-Leaflet 4**: React components for Leaflet integration
- **Leaflet-Draw**: Drawing tools for polygon creation and editing

### State Management & Data
- **Redux Toolkit 2**: Modern Redux for predictable state management
- **Axios 1**: HTTP client for API communication with interceptors
- **React Hook Form 7**: Performant form library with validation

### UI & Visualization
- **Recharts 3**: Composable charting library for React
- **Lucide React**: Feather-inspired icon library
- **Framer Motion 12**: Production-ready motion library
- **React DatePicker**: Date selection components

### File & Export Management
- **React Dropzone 14**: Drag-and-drop file upload component
- **jsPDF 3**: Client-side PDF generation
- **React CSV 2**: CSV export functionality

### Authentication & Security
- **jsonwebtoken 9**: JWT implementation for Node.js
- **bcryptjs 3**: Password hashing library
- **Helmet 8**: Express security middleware
- **CORS 2**: Cross-Origin Resource Sharing middleware

### Internationalization & Development
- **react-i18next 15**: Internationalization framework for React
- **ESLint 9**: JavaScript linting with React-specific rules
- **PostCSS 8**: CSS transformation tool for TailwindCSS processing

### Planned Integrations
- **PostgreSQL with PostGIS**: Production database for advanced geospatial operations
- **Satellite Data APIs**: FSI, NRSC, ESA Copernicus for remote sensing integration
- **Real-time Updates**: WebSocket integration for live notifications and claim status updates