import 'express';

declare module 'express' {
  interface Request {
    cookies?: {
      Authentication?: string;
      [key: string]: string | undefined;
    };
  }
}
