-- Database optimization script for RealityCanvas
-- This script adds indexes to improve query performance and reduce database load

-- Project table indexes
CREATE INDEX IF NOT EXISTS idx_project_slug ON "Project"(slug);
CREATE INDEX IF NOT EXISTS idx_project_category ON "Project"(category);
CREATE INDEX IF NOT EXISTS idx_project_status ON "Project"(status);
CREATE INDEX IF NOT EXISTS idx_project_city ON "Project"(city);
CREATE INDEX IF NOT EXISTS idx_project_created_at ON "Project"("createdAt");

-- Unit table indexes
CREATE INDEX IF NOT EXISTS idx_unit_project_id ON "Unit"("projectId");
CREATE INDEX IF NOT EXISTS idx_unit_availability ON "Unit"(availability);
CREATE INDEX IF NOT EXISTS idx_unit_floor ON "Unit"(floor);
CREATE INDEX IF NOT EXISTS idx_unit_type ON "Unit"(type);
CREATE INDEX IF NOT EXISTS idx_unit_project_floor ON "Unit"("projectId", floor);

-- Amenity table indexes
CREATE INDEX IF NOT EXISTS idx_amenity_project_id ON "Amenity"("projectId");
CREATE INDEX IF NOT EXISTS idx_amenity_category ON "Amenity"(category);
CREATE INDEX IF NOT EXISTS idx_amenity_project_category ON "Amenity"("projectId", category);

-- Highlight table indexes
CREATE INDEX IF NOT EXISTS idx_highlight_project_id ON "Highlight"("projectId");

-- FAQ table indexes
CREATE INDEX IF NOT EXISTS idx_faq_project_id ON "Faq"("projectId");

-- FloorPlan table indexes
CREATE INDEX IF NOT EXISTS idx_floorplan_project_id ON "FloorPlan"("projectId");
CREATE INDEX IF NOT EXISTS idx_floorplan_sort_order ON "FloorPlan"("sortOrder");
CREATE INDEX IF NOT EXISTS idx_floorplan_project_sort ON "FloorPlan"("projectId", "sortOrder");

-- AnchorTenant table indexes
CREATE INDEX IF NOT EXISTS idx_anchor_project_id ON "AnchorTenant"("projectId");
CREATE INDEX IF NOT EXISTS idx_anchor_status ON "AnchorTenant"(status);
CREATE INDEX IF NOT EXISTS idx_anchor_category ON "AnchorTenant"(category);

-- NearbyPoint table indexes
CREATE INDEX IF NOT EXISTS idx_nearbypoint_project_id ON "NearbyPoint"("projectId");
CREATE INDEX IF NOT EXISTS idx_nearbypoint_type ON "NearbyPoint"(type);
CREATE INDEX IF NOT EXISTS idx_nearbypoint_distance ON "NearbyPoint"("distanceKm");

-- Media table indexes
CREATE INDEX IF NOT EXISTS idx_media_project_id ON "Media"("projectId");
CREATE INDEX IF NOT EXISTS idx_media_type ON "Media"(type);
CREATE INDEX IF NOT EXISTS idx_media_sort_order ON "Media"("sortOrder");

-- PricingTable table indexes
CREATE INDEX IF NOT EXISTS idx_pricingtable_project_id ON "PricingTable"("projectId");
CREATE INDEX IF NOT EXISTS idx_pricingtable_type ON "PricingTable"(type);

-- PricingPlan table indexes
CREATE INDEX IF NOT EXISTS idx_pricingplan_project_id ON "PricingPlan"("projectId");
CREATE INDEX IF NOT EXISTS idx_pricingplan_type ON "PricingPlan"("planType");

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_project_category_status ON "Project"(category, status);
CREATE INDEX IF NOT EXISTS idx_project_city_category ON "Project"(city, category);
CREATE INDEX IF NOT EXISTS idx_unit_project_availability ON "Unit"("projectId", availability);
CREATE INDEX IF NOT EXISTS idx_unit_project_type ON "Unit"("projectId", type);

-- Performance optimization: Add partial indexes for common filters
CREATE INDEX IF NOT EXISTS idx_project_active ON "Project"(id) WHERE status IN ('READY', 'UNDER_CONSTRUCTION');
CREATE INDEX IF NOT EXISTS idx_unit_available ON "Unit"("projectId") WHERE availability = 'AVAILABLE';

-- Add statistics update for better query planning
ANALYZE "Project";
ANALYZE "Unit";
ANALYZE "Amenity";
ANALYZE "Highlight";
ANALYZE "Faq";
ANALYZE "FloorPlan";
ANALYZE "AnchorTenant";
ANALYZE "NearbyPoint";
ANALYZE "Media";
ANALYZE "PricingTable";
ANALYZE "PricingPlan";