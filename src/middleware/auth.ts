import { Request, Response, NextFunction } from "express";
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false,
          message: "Unauthorized: No token provided" 
        });
      }
      
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: "Unauthorized: Invalid token format" 
        });
      }
      
      const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
      req.user = decoded;
      
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false,
          message: "Forbidden: Insufficient permissions" 
        });
      }
      
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: "Unauthorized: Token expired" 
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          message: "Unauthorized: Invalid token" 
        });
      }
      
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized" 
      });
    }
  };
};

export default auth;