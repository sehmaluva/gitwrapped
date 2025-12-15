/**
 * Production-ready logger utility
 * Logs are structured for easy parsing in Vercel/CloudWatch/etc.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogData {
  [key: string]: unknown;
}

// Only show debug logs in development
const LOG_LEVEL: LogLevel = (process.env.NODE_ENV === 'production') ? 'info' : 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL];
}

function formatLog(level: LogLevel, context: string, message: string, data?: LogData): string {
  const log = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    context,
    message,
    ...(data && { data }),
  };
  return JSON.stringify(log);
}

export const logger = {
  debug(context: string, message: string, data?: LogData) {
    if (shouldLog('debug')) {
      console.log(formatLog('debug', context, message, data));
    }
  },

  info(context: string, message: string, data?: LogData) {
    if (shouldLog('info')) {
      console.log(formatLog('info', context, message, data));
    }
  },

  warn(context: string, message: string, data?: LogData) {
    if (shouldLog('warn')) {
      console.warn(formatLog('warn', context, message, data));
    }
  },

  error(context: string, message: string, error?: unknown, data?: LogData) {
    if (shouldLog('error')) {
      const errorData: LogData = { ...data };
      
      if (error instanceof Error) {
        errorData.error = {
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 5).join('\n'),
        };
      } else if (error) {
        errorData.error = error;
      }
      
      console.error(formatLog('error', context, message, errorData));
    }
  },

  // Convenience method for auth-related logs
  auth(message: string, data?: LogData) {
    this.info('AUTH', message, data);
  },

  // Convenience method for API-related logs
  api(message: string, data?: LogData) {
    this.info('API', message, data);
  },
};

export default logger;
