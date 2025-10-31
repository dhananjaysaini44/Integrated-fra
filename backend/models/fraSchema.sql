-- FRA Atlas Database Schema
-- PostgreSQL with PostGIS extension

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Administrative Boundaries
CREATE TABLE administrative_boundaries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL, -- country, state, district, block, village
    parent_id INTEGER REFERENCES administrative_boundaries(id),
    state_code VARCHAR(10),
    district_code VARCHAR(10),
    block_code VARCHAR(10),
    village_code VARCHAR(10),
    population INTEGER,
    area_sqkm DECIMAL(10,2),
    geom GEOMETRY(MULTIPOLYGON, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forest Cover Data
CREATE TABLE forest_cover (
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100),
    year INTEGER NOT NULL,
    cover_type VARCHAR(100) NOT NULL, -- dense_forest, open_forest, scrub, non_forest
    area_ha DECIMAL(12,2) NOT NULL,
    canopy_density VARCHAR(20), -- very_dense, moderately_dense, open
    legal_status VARCHAR(100), -- reserved, protected, unclassified
    geom GEOMETRY(MULTIPOLYGON, 4326),
    source VARCHAR(255), -- FSI, NRSC, etc.
    acquisition_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FRA Claims
CREATE TABLE fra_claims (
    id SERIAL PRIMARY KEY,
    claim_id VARCHAR(50) UNIQUE NOT NULL,
    claimant_name VARCHAR(255),
    father_husband_name VARCHAR(255),
    gender VARCHAR(20),
    age INTEGER,
    caste_category VARCHAR(50),
    address TEXT,
    village_name VARCHAR(255),
    gram_panchayat VARCHAR(255),
    block_name VARCHAR(255),
    district_name VARCHAR(255),
    state_name VARCHAR(255),
    pincode VARCHAR(10),

    -- Land Details
    plot_number VARCHAR(100),
    khasra_number VARCHAR(100),
    land_area_ha DECIMAL(8,2),
    land_type VARCHAR(100), -- individual, community, common
    forest_type VARCHAR(100), -- reserved, protected, unclassified

    -- Claim Details
    claim_type VARCHAR(100), -- individual_rights, community_rights, community_forest_resource
    claim_subtype VARCHAR(100),
    claim_status VARCHAR(50), -- submitted, under_process, approved, rejected, withdrawn
    submission_date DATE,
    approval_date DATE,
    rejection_reason TEXT,

    -- Financial Details
    compensation_amount DECIMAL(12,2),
    relief_amount DECIMAL(12,2),

    -- Spatial Data
    geom GEOMETRY(MULTIPOLYGON, 4326),

    -- Metadata
    data_source VARCHAR(255), -- govt_api, manual_entry, survey
    verification_status VARCHAR(50), -- verified, pending, disputed
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tribal Population Data
CREATE TABLE tribal_population (
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100),
    block_name VARCHAR(100),
    village_name VARCHAR(100),
    total_population INTEGER,
    tribal_population INTEGER,
    scheduled_tribe_population INTEGER,
    forest_village BOOLEAN DEFAULT FALSE,
    revenue_village BOOLEAN DEFAULT FALSE,
    census_year INTEGER NOT NULL,
    geom GEOMETRY(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Land Encroachment Data
CREATE TABLE land_encroachment (
    id SERIAL PRIMARY KEY,
    encroachment_id VARCHAR(50) UNIQUE,
    state_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100),
    forest_division VARCHAR(100),
    compartment_number VARCHAR(50),
    plot_number VARCHAR(50),
    encroachment_area_ha DECIMAL(8,2),
    encroachment_type VARCHAR(100), -- agriculture, habitation, infrastructure
    encroacher_name VARCHAR(255),
    encroacher_category VARCHAR(50), -- individual, community, government
    detection_date DATE,
    action_taken VARCHAR(255),
    status VARCHAR(50), -- detected, notice_issued, removed, legal_case
    geom GEOMETRY(MULTIPOLYGON, 4326),
    satellite_image_path VARCHAR(500),
    detection_method VARCHAR(100), -- manual, satellite, drone
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Satellite Imagery Metadata
CREATE TABLE satellite_imagery (
    id SERIAL PRIMARY KEY,
    image_id VARCHAR(100) UNIQUE NOT NULL,
    satellite_name VARCHAR(50), -- Landsat, Sentinel, Resourcesat
    sensor VARCHAR(50),
    acquisition_date DATE NOT NULL,
    cloud_cover_percentage DECIMAL(5,2),
    spatial_resolution_m DECIMAL(6,2),
    bands_available TEXT[], -- array of available bands
    image_path VARCHAR(500),
    thumbnail_path VARCHAR(500),
    geom GEOMETRY(POLYGON, 4326), -- footprint
    processing_level VARCHAR(20), -- L1, L2, etc.
    data_source VARCHAR(100), -- USGS, ESA, ISRO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alert System
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    alert_id VARCHAR(50) UNIQUE NOT NULL,
    alert_type VARCHAR(100) NOT NULL, -- encroachment, deforestation, claim_overlap
    severity VARCHAR(20), -- low, medium, high, critical
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location_name VARCHAR(255),
    district_name VARCHAR(100),
    state_name VARCHAR(100),
    area_affected_ha DECIMAL(8,2),
    detection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(MULTIPOLYGON, 4326),
    status VARCHAR(50) DEFAULT 'active', -- active, resolved, false_positive
    assigned_to VARCHAR(255),
    resolution_date TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data Quality Metrics
CREATE TABLE data_quality_metrics (
    id SERIAL PRIMARY KEY,
    dataset_name VARCHAR(100) NOT NULL,
    record_count INTEGER,
    completeness_score DECIMAL(5,2), -- percentage
    accuracy_score DECIMAL(5,2),
    consistency_score DECIMAL(5,2),
    timeliness_days INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessment_date DATE DEFAULT CURRENT_DATE
);

-- Spatial Indexes for Performance
CREATE INDEX idx_admin_boundaries_geom ON administrative_boundaries USING GIST(geom);
CREATE INDEX idx_forest_cover_geom ON forest_cover USING GIST(geom);
CREATE INDEX idx_fra_claims_geom ON fra_claims USING GIST(geom);
CREATE INDEX idx_tribal_pop_geom ON tribal_population USING GIST(geom);
CREATE INDEX idx_encroachment_geom ON land_encroachment USING GIST(geom);
CREATE INDEX idx_satellite_geom ON satellite_imagery USING GIST(geom);
CREATE INDEX idx_alerts_geom ON alerts USING GIST(geom);

-- Regular Indexes
CREATE INDEX idx_fra_claims_status ON fra_claims(claim_status);
CREATE INDEX idx_fra_claims_state ON fra_claims(state_name);
CREATE INDEX idx_fra_claims_district ON fra_claims(district_name);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_forest_cover_year ON forest_cover(year);
CREATE INDEX idx_satellite_date ON satellite_imagery(acquisition_date);

-- Views for Common Queries
CREATE VIEW active_fra_claims AS
SELECT * FROM fra_claims
WHERE claim_status IN ('submitted', 'under_process');

CREATE VIEW forest_cover_summary AS
SELECT
    state_name,
    year,
    cover_type,
    SUM(area_ha) as total_area_ha,
    COUNT(*) as polygon_count
FROM forest_cover
GROUP BY state_name, year, cover_type
ORDER BY state_name, year;

CREATE VIEW encroachment_hotspots AS
SELECT
    state_name,
    district_name,
    COUNT(*) as encroachment_count,
    SUM(encroachment_area_ha) as total_area_affected,
    AVG(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - detection_date))/86400) as avg_days_since_detection
FROM land_encroachment
WHERE status = 'detected'
GROUP BY state_name, district_name
HAVING COUNT(*) > 5;
