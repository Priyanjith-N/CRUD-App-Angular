import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AuthAdminReq from '../interfaces/AuthAdminReqInterface';

function verifyToken(req: AuthAdminReq, res: Response, next: NextFunction) {
    const token: string | undefined = req.header('Authorization');
    

    if(!token)return res.status(401).json({isAuth: false, error: 'Access denied'});

    try {
        const decoded = jwt.verify(token, process.env.JWTSecrectKey!) as JwtPayload;
        req.email = decoded.email;

        if(decoded.type !== "Admin"){
            res.status(401).json({ invalidToken: false, error: 'Invalid token' });
            return;
        }
        
        next();
    } catch (err: any) {
        console.error('Error:', err);
        res.status(401).json({ invalidToken: false, error: 'Invalid token' });
    }
}

export default verifyToken;