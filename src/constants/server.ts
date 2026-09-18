export const LOCAL_SERVER_IP_HOST = 'http://192.168.1.38:8080';
export const LOCAL_SERVER_HOST = 'http://localhost:8080';
export const PRODUCTION_SERVER = 'https://school-portal-backend-wt5b.onrender.com';
export const EC2_SERVER_HOST = PRODUCTION_SERVER;
export const NODE_ENV = process.env.NODE_ENV;
export const server = PRODUCTION_SERVER + '/';
// Set REACT_APP_API_HOST in your host (Render static site / .env) to override.
export const HOST = process.env.REACT_APP_API_HOST || PRODUCTION_SERVER;
export const IMAGES_HOST = HOST;
export const API_HOST = `${HOST}/api`;
