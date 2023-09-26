import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const secretKey = process.env.secretToken as string;


export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.query.token as string
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing token' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    (req as any).user = decoded;
    next();
  });
}
