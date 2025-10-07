# Database Connection & Caching Troubleshooting Guide

## Overview
This guide helps diagnose and resolve issues where products disappear from the application after heavy usage or prolonged interaction.

## Common Symptoms
- Products not loading after extended use
- Empty product lists requiring database restart
- Intermittent data fetching failures
- Application appears to lose database connection

## Monitoring Endpoints

### 1. Database Connection Health
```
GET /api/health/connection
```
Returns detailed connection metrics including:
- Connection pool status
- Recent errors and timestamps
- Reconnection attempts
- Overall health status

### 2. Cache Statistics
```
GET /api/debug/cache
```
Returns cache performance metrics:
- Hit/miss rates
- Cache sizes and limits
- Memory usage
- Eviction statistics

### 3. Clear Cache (Debug)
```
DELETE /api/debug/cache?type=project
DELETE /api/debug/cache?type=general
DELETE /api/debug/cache  # Clear all
```

## Implemented Solutions

### 1. Enhanced Database Connection Pooling
**File:** `src/lib/prisma.ts`
- Added connection limits (10 concurrent connections)
- Pool timeout: 10 seconds
- Idle timeout: 5 minutes
- Automatic connection monitoring

### 2. Connection Monitoring System
**File:** `src/lib/connection-monitor.ts`
- Real-time health checks every 30 seconds
- Automatic reconnection with exponential backoff
- Connection metrics tracking
- Graceful shutdown handling

### 3. Improved Cache Management
**File:** `src/lib/cache-manager.ts`
- Centralized cache with TTL management
- Automatic cleanup of expired entries
- Memory-efficient LRU eviction
- Cache statistics and monitoring

### 4. Enhanced API Route Caching
**File:** `src/app/api/projects/[id]/route.ts`
- Reduced cache TTL to 2 minutes for fresher data
- Better cache cleanup and size limits
- Access tracking for optimal eviction
- Proper ETag handling

## Troubleshooting Steps

### Step 1: Check Database Connection
```bash
curl http://localhost:3000/api/health/connection
```
Look for:
- `isHealthy: true`
- Low `reconnectAttempts`
- Recent `lastSuccessfulConnection`

### Step 2: Monitor Cache Performance
```bash
curl http://localhost:3000/api/debug/cache
```
Check for:
- Reasonable hit rates (>70%)
- Cache sizes within limits
- Low eviction rates

### Step 3: Clear Caches if Needed
```bash
# Clear all caches
curl -X DELETE http://localhost:3000/api/debug/cache

# Or clear specific cache
curl -X DELETE http://localhost:3000/api/debug/cache?type=project
```

### Step 4: Monitor Application Logs
Look for these log messages:
- `🔍 Starting database connection monitoring...`
- `✅ Database reconnection successful`
- `🧹 Cache cleanup: removed X entries`
- `❌ Database health check failed`

## Environment Variables

Ensure these are properly set:
```env
DATABASE_URL=your_supabase_connection_string
NODE_ENV=production  # or development
```

## Performance Recommendations

### 1. Database Connection Limits
- Monitor concurrent connections in Supabase dashboard
- Adjust `connectionLimit` in `prisma.ts` if needed
- Consider connection pooling at infrastructure level

### 2. Cache Configuration
- Adjust TTL based on data update frequency
- Monitor memory usage with cache statistics
- Consider Redis for distributed caching if scaling

### 3. API Route Optimization
- Use proper HTTP caching headers
- Implement conditional requests with ETags
- Consider implementing stale-while-revalidate patterns

## Common Issues & Solutions

### Issue: "Products disappear after heavy usage"
**Cause:** Connection pool exhaustion or cache corruption
**Solution:** 
1. Check connection health endpoint
2. Clear caches if corrupted
3. Monitor connection pool metrics

### Issue: "Database restart required to see products"
**Cause:** Stale connections or connection leaks
**Solution:**
1. Connection monitor will auto-reconnect
2. Check for connection leaks in custom queries
3. Ensure proper connection cleanup

### Issue: "Intermittent data fetching failures"
**Cause:** Network issues or connection timeouts
**Solution:**
1. Monitor connection health over time
2. Check network stability
3. Adjust timeout configurations if needed

## Alerting & Monitoring

Consider setting up alerts for:
- Connection health failures
- High cache miss rates
- Memory usage spikes
- Frequent reconnection attempts

## Support

If issues persist:
1. Collect logs from monitoring endpoints
2. Check Supabase dashboard for connection metrics
3. Monitor application memory usage
4. Review recent code changes affecting database queries

## Files Modified/Created

### Core Files
- `src/lib/prisma.ts` - Enhanced connection pooling
- `src/lib/connection-monitor.ts` - Connection monitoring system
- `src/lib/cache-manager.ts` - Centralized cache management

### API Routes
- `src/app/api/health/connection/route.ts` - Connection health endpoint
- `src/app/api/debug/cache/route.ts` - Cache debugging endpoint
- `src/app/api/projects/[id]/route.ts` - Enhanced project caching

### Documentation
- `README-TROUBLESHOOTING.md` - This troubleshooting guide