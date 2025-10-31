# TODO for FRA Atlas Full-Stack System

## Project Overview
Development of AI-powered FRA Atlas and WebGIS-based Decision Support System (DSS) for Integrated Monitoring of Forest Rights Act (FRA) Implementation.
Focus States: Madhya Pradesh, Tripura, Odisha, Telangana

## Phase 1: Frontend Completion and Enhancement ✅
- [x] Core setup with Vite, React, TailwindCSS, React Router, Redux Toolkit
- [x] Authentication pages (Login, Signup, ForgotPassword) with mock auth
- [x] MainLayout with responsive sidebar navigation, header, footer
- [x] Dashboard with KPI cards, charts (Recharts), recent activity, quick actions
- [x] Map page with Leaflet integration, layers, search, polygon drawing tools (centered on MP, Tripura, Odisha, Telangana)
- [x] Landing page with hero, features, about, demo previews, CTA, footer
- [x] Development server running on http://localhost:5176/
- [ ] Complete remaining pages: ClaimSubmission, ClaimTracking, Alerts, Reports, Admin, Profile
- [x] Add Redux slices for claims, alerts, reports, users (auth slice ready)
- [x] Create API service wrappers (AuthService, ClaimService created)
- [ ] Implement mock APIs for alerts, reports, users
- [ ] Create AlertService, ReportService, UserService
- [ ] Add dark/light mode toggle functionality (UI ready, needs persistence)
- [ ] Multi-language support (English/Hindi) with react-i18next
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Error boundaries and loading skeletons
- [ ] Form validation improvements with react-hook-form
- [ ] File upload functionality for documents
- [ ] PDF/CSV export functionality
- [ ] Real-time notifications system

## Phase 2: Data Foundation and Integration 🚀 IN PROGRESS
- [ ] Set up PostgreSQL + PostGIS database with FRA schema
- [ ] Implement data acquisition scripts for FSI, NRSC, ESA Copernicus
- [ ] Create data preprocessing pipelines (Python/GeoPandas)
- [ ] Develop automated data update system
- [ ] Integrate satellite imagery layers (Landsat, Sentinel)
- [ ] Add administrative boundaries for focus states
- [ ] Implement real FRA claims data processing
- [ ] Create geospatial data validation framework

## Phase 2: Backend Setup
- [ ] Create /backend directory
- [ ] Initialize Express.js server
- [ ] Set up PostgreSQL + PostGIS database
- [ ] Create database schema for FRA claims, boundaries, alerts
- [ ] Implement REST API endpoints:
  - /api/auth (login, signup, JWT)
  - /api/claims (CRUD operations)
  - /api/alerts
  - /api/reports
  - /api/users (admin panel)
- [ ] Add middleware for authentication, CORS, rate limiting
- [ ] Integrate with open source geospatial data

## Phase 3: AI Microservices
- [ ] Create /models directory
- [ ] OCR Service (FastAPI + Tesseract + Hugging Face)
  - Process claim documents
  - Extract text and metadata
- [ ] Landcover Classification Service
  - Satellite image analysis
  - Forest/non-forest classification
- [ ] Duplicate Detection Service
  - Embedding-based similarity matching
  - Prevent duplicate claims
- [ ] DSS Integration Service
  - Link FRA data with CSS benefits (PM-KISAN, MGNREGA, etc.)

## Phase 4: Data Integration
- [ ] Integrate legacy FRA records
- [ ] Add satellite imagery layers (Landsat, Sentinel)
- [ ] Boundary data for focus states
- [ ] CSS benefits data integration
- [ ] Real-time monitoring data

## Phase 5: Testing and Deployment
- [ ] Unit tests for components and services
- [ ] Integration tests for API endpoints
- [ ] End-to-end testing of claim workflow
- [ ] Performance optimization
- [ ] Production deployment setup
- [ ] Documentation and user guides

## Phase 6: Monitoring and Maintenance
- [ ] Logging and error tracking
- [ ] Performance monitoring
- [ ] Security audits
- [ ] User feedback integration
