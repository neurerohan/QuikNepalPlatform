// This file serves as the entry point for Vercel serverless function
import { Request, Response } from 'express';
import app from '../server/index';

// Export a function that processes all HTTP methods on all paths
export default async function handler(req: Request, res: Response) {
  // Let the Express app handle the request
  return app(req, res);
} 