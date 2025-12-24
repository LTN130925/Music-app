import rateLimit from 'express-rate-limit';
import {Request, Response} from 'express';

export const rateLimitAuthMiddleware = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    handler: (req: Request, res: Response) => {
        req.flash('error', 'Bạn đăng nhập quá nhiều lần, thử lại sau 5 phút');
        res.redirect('/auth/login');
    }
});