import { prisma } from './prisma';

// Connection monitoring and recovery system
class ConnectionMonitor {
  private isMonitoring = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private lastSuccessfulConnection = Date.now();
  
  // Connection pool metrics
  private connectionMetrics = {
    activeConnections: 0,
    totalQueries: 0,
    failedQueries: 0,
    lastError: null as string | null,
    lastErrorTime: null as Date | null,
  };

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🔍 Starting database connection monitoring...');
    
    // Health check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000);

    // Monitor for connection events
    this.setupConnectionEventListeners();
  }

  private setupConnectionEventListeners() {
    // Monitor process events that might affect connections
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
    process.on('uncaughtException', (error) => {
      console.error('🚨 Uncaught exception affecting database:', error);
      this.handleConnectionError(error);
    });
  }

  private async performHealthCheck() {
    try {
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1 as health_check`;
      const responseTime = Date.now() - startTime;
      
      this.lastSuccessfulConnection = Date.now();
      this.reconnectAttempts = 0; // Reset on successful connection
      
      // Log slow queries
      if (responseTime > 5000) {
        console.warn(`⚠️ Slow database response: ${responseTime}ms`);
      }
      
      // Update metrics
      this.connectionMetrics.totalQueries++;
      
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      this.handleConnectionError(error);
    }
  }

  private async handleConnectionError(error: any) {
    this.connectionMetrics.failedQueries++;
    this.connectionMetrics.lastError = error.message;
    this.connectionMetrics.lastErrorTime = new Date();
    
    const timeSinceLastSuccess = Date.now() - this.lastSuccessfulConnection;
    
    // If connection has been failing for more than 2 minutes, attempt recovery
    if (timeSinceLastSuccess > 120000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      await this.attemptReconnection();
    }
  }

  private async attemptReconnection() {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    console.log(`🔄 Attempting database reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      // Force disconnect and reconnect
      await prisma.$disconnect();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      await prisma.$connect();
      
      // Test the connection
      await prisma.$queryRaw`SELECT 1 as reconnect_test`;
      
      console.log('✅ Database reconnection successful');
      this.lastSuccessfulConnection = Date.now();
      this.reconnectAttempts = 0;
      
    } catch (error) {
      console.error(`❌ Reconnection attempt ${this.reconnectAttempts} failed:`, error);
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('🚨 Max reconnection attempts reached. Manual intervention required.');
        // Could trigger alerts here
      }
    }
  }

  private async gracefulShutdown() {
    console.log('🛑 Gracefully shutting down database connections...');
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    this.isMonitoring = false;
    
    try {
      await prisma.$disconnect();
      console.log('✅ Database connections closed successfully');
    } catch (error) {
      console.error('❌ Error during database shutdown:', error);
    }
  }

  // Public method to get connection metrics
  public getMetrics() {
    return {
      ...this.connectionMetrics,
      isHealthy: Date.now() - this.lastSuccessfulConnection < 60000, // Healthy if connected in last minute
      reconnectAttempts: this.reconnectAttempts,
      lastSuccessfulConnection: new Date(this.lastSuccessfulConnection),
    };
  }

  // Public method to force a health check
  public async forceHealthCheck() {
    return await this.performHealthCheck();
  }
}

// Create singleton instance
export const connectionMonitor = new ConnectionMonitor();

// Export metrics endpoint helper
export function getConnectionHealth() {
  return connectionMonitor.getMetrics();
}