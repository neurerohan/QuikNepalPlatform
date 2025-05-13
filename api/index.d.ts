declare module '@vercel/node' {
  import { IncomingMessage, ServerResponse } from 'http';
  
  export interface VercelRequest extends IncomingMessage {
    query: { [key: string]: string | string[] };
    cookies: { [key: string]: string };
    body: any;
  }
  
  export interface VercelResponse extends ServerResponse {
    send: (body: any) => VercelResponse;
    json: (body: any) => VercelResponse;
    status: (statusCode: number) => VercelResponse;
    redirect: (statusOrUrl: string | number, url?: string) => VercelResponse;
  }
  
  export interface VercelApiHandler {
    (req: VercelRequest, res: VercelResponse): void | Promise<void>;
  }
} 