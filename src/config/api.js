// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Environment-specific configurations
export const getApiConfig = () => {
  const env = import.meta.env.MODE || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...API_CONFIG,
        BASE_URL: 'https://your-production-api.com/api',
      };
    case 'staging':
      return {
        ...API_CONFIG,
        BASE_URL: 'https://your-staging-api.com/api',
      };
    default:
      return API_CONFIG;
  }
};

export default getApiConfig();
