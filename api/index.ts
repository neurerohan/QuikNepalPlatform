// This file serves as the entry point for Vercel serverless function
import { IncomingMessage, ServerResponse } from 'http';
import app from '../server/index';

// Handler function that will be called by Vercel
export default function handler(req: IncomingMessage, res: ServerResponse) {
  // Pass the request to Express
  return app(req, res);
}

// Vercel serverless function configuration
export const config = {
  api: {
    bodyParser: false, // Let Express handle body parsing
  }
}; 