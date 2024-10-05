import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
      req.user = { id: decoded.id as string, role: decoded.role as string };
      next();
    } else {
      res.status(401).json({ message: 'Invalid token payload' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Access forbidden' });
  next();
};
