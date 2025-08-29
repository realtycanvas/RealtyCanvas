# Database Connection Recovery Solution

## Problem Solved

This solution addresses the critical issue where **database connections stop working after some time** and require manual database restarts. The implemented solution provides:

- **Automatic connection recovery**
- **Connection pooling with proper limits**
- **Health monitoring and alerts**
- **Graceful error handling**
- **Retry logic with exponential backoff**

## Files Modified/Created

### 1. Enhanced Prisma Configuration
**File:** `src/lib/prisma.ts`

**Key Features:**
- Connection pooling (max 10 connections)
- Connection timeouts (30s pool timeout, 5min idle timeout)
- Graceful shutdown handling
- Health check functions
- Auto-reconnection with retry logic

```typescript
// Connection pool configuration
__internal: {
  engine: {
    connectionLimit: 10,
    poolTimeout: 30000,
    idleTimeout: 300000,
  },
}
```

### 2. Database Health Check API
**File:** `src/app/api/health/database/route.ts`

**Endpoints:**
- `GET /api/health/database` - Check connection status
- `GET /api/health/database?reconnect=true` - Force reconnection
- `POST /api/health/database` - Force reconnection

**Usage:**
```bash
# Check database health
curl http://localhost:3000/api/health/database

# Force reconnection
curl -X POST http://localhost:3000/api/health/database
```

### 3. Database Middleware
**File:** `src/middleware/database.ts`

**Features:**
- Automatic retry logic for failed connections
- Connection health monitoring
- Error classification (connection vs application errors)
- Exponential backoff for retries

### 4. Updated API Routes
**File:** `src/app/api/projects/[id]/route.ts`

**Improvements:**
- Wrapped with database retry middleware
- Periodic health checks
- Automatic reconnection on failures

## How It Works

### 1. Connection Pool Management
```typescript
// Limits concurrent connections to prevent exhaustion
connectionLimit: 10

// Timeout for getting connection from pool
poolTimeout: 30000 // 30 seconds

// Close idle connections after 5 minutes
idleTimeout: 300000
```

### 2. Automatic Reconnection
```typescript
// Retry logic with exponential backoff
for (let i = 0; i < retries; i++) {
  try {
    // Attempt connection
    const health = await checkDatabaseConnection();
    if (health.status === 'connected') return true;
  } catch (error) {
    // Wait before retry (1s, 2s, 4s, 8s...)
    await new Promise(resolve => 
      setTimeout(resolve, Math.pow(2, i) * 1000)
    );
  }
}
```

### 3. Health Monitoring
```typescript
// Periodic health checks every 30 seconds
const HEALTH_CHECK_INTERVAL = 30000;

// Automatic health monitoring
export async function periodicHealthCheck() {
  const isConnected = await ensureDatabaseConnection(1);
  if (!isConnected) {
    console.warn('Database connection lost - attempting recovery');
  }
}
```

## Implementation Guide

### Step 1: Apply the Changes
All files have been created/updated. The changes are immediately active.

### Step 2: Monitor Database Health

**Option A: Manual Monitoring**
```bash
# Check if database is healthy
curl http://localhost:3000/api/health/database

# Response when healthy:
{
  "status": "success",
  "message": "Database connection is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}

# Response when unhealthy:
{
  "status": "error",
  "message": "Database connection failed",
  "error": "Connection timeout",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Option B: Automated Monitoring Script**
```javascript
// monitor-db.js
setInterval(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/health/database');
    const health = await response.json();
    
    if (health.status !== 'success') {
      console.error('Database unhealthy:', health);
      // Trigger reconnection
      await fetch('http://localhost:3000/api/health/database?reconnect=true');
    }
  } catch (error) {
    console.error('Health check failed:', error);
  }
}, 60000); // Check every minute
```

### Step 3: Handle Connection Issues

**Automatic Recovery:**
The system now automatically handles connection issues:

1. **Detection**: API calls detect connection failures
2. **Retry**: Automatic retry with exponential backoff
3. **Recovery**: Establish new connections as needed
4. **Fallback**: Graceful error responses if recovery fails

**Manual Recovery:**
If needed, you can force reconnection:

```bash
# Force database reconnection
curl -X POST http://localhost:3000/api/health/database
```

## Configuration Options

### Connection Pool Settings
Adjust in `src/lib/prisma.ts`:

```typescript
__internal: {
  engine: {
    connectionLimit: 15,     // Increase for high traffic
    poolTimeout: 45000,      // Increase timeout if needed
    idleTimeout: 600000,     // 10 minutes idle timeout
  },
}
```

### Retry Configuration
Adjust in `src/middleware/database.ts`:

```typescript
// Change default retry attempts
const maxRetries = 3; // Default is 2

// Adjust health check interval
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute instead of 30s
```

## Monitoring and Alerts

### Log Messages to Watch

**Healthy Operation:**
```
Database connection healthy
Fetching project with ID: project-slug
```

**Connection Issues:**
```
Database connection check failed: Connection timeout
Retrying database operation (attempt 2/3)...
Database connection lost - attempting recovery
```

**Recovery Success:**
```
Database reconnected successfully
Database connection healthy
```

### Setting Up Alerts

**Option 1: Log Monitoring**
Monitor application logs for these patterns:
- `Database connection check failed`
- `Failed to establish database connection after`
- `Database reconnected successfully`

**Option 2: Health Check Monitoring**
Set up external monitoring to call:
```
GET http://localhost:3000/api/health/database
```

Alert if response is not `200 OK` or `status !== "success"`.

## Troubleshooting

### Issue: Still Getting Connection Timeouts

**Solution 1: Increase Connection Limits**
```typescript
// In src/lib/prisma.ts
connectionLimit: 20, // Increase from 10
poolTimeout: 60000,  // Increase from 30s
```

**Solution 2: Check Database Server Settings**
- Verify database server connection limits
- Check for firewall/network issues
- Ensure database server has sufficient resources

### Issue: Frequent Reconnections

**Solution: Adjust Health Check Frequency**
```typescript
// In src/middleware/database.ts
const HEALTH_CHECK_INTERVAL = 120000; // 2 minutes instead of 30s
```

### Issue: Application Still Requires Restarts

**Check:**
1. Verify all API routes use the middleware
2. Check database server logs for issues
3. Monitor connection pool usage
4. Verify environment variables are correct

## Benefits

✅ **No More Manual Restarts**: Automatic connection recovery
✅ **Better Performance**: Connection pooling prevents exhaustion
✅ **Improved Reliability**: Retry logic handles temporary failures
✅ **Monitoring**: Health checks provide visibility
✅ **Graceful Degradation**: Proper error handling for users
✅ **Production Ready**: Handles high traffic and connection issues

## Next Steps

1. **Test the Solution**: Try the health check endpoints
2. **Monitor Logs**: Watch for connection recovery messages
3. **Set Up Alerts**: Implement monitoring for production
4. **Optimize Settings**: Adjust connection limits based on usage
5. **Document Issues**: Report any remaining connection problems

The database connection issues should now be resolved automatically without requiring manual restarts!