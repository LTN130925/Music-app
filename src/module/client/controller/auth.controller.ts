import {Request, Response} from 'express';

import {authService} from '../service/auth.service';
const serviceInstance = new authService();

export class controller {
    register(req: Request, res: Response) {
        res.render('client/pages/auth/register', {
            titlePage: 'Trang đăng kí',
        });
    }

    forgot(req: Request, res: Response) {
        res.render('client/pages/auth/forgot', {
            titlePage: 'Quân mật khẩu',
        })
    }

    async forgotPost(req: Request, res: Response) {
        const {email} = req.body;
        const result = await serviceInstance.confirmEmail(email);
        if (!result) {
            req.flash('error', 'Không tồn tại email đã nhập!');
            return res.redirect(req.get('referrent') || '/');
        }
        req.session['text'] = email;
        req.flash('success', 'Đã gửi mã OTP qua email của bạn, Hãy kiểm tra và xác thực OTP!')
        res.redirect('/auth/forgot/otp');
    }

    forgotOtp(req: Request, res: Response) {
        res.render('client/pages/auth/otp', {
            titlePage: 'Trang xác thực otp',
            email: req.session['text']
        });
    }

    async forgotOtpPost(req: Request, res: Response) {
        const {email} = req.query;
        const {otp} = req.body;
        const confirmOtp = await serviceInstance.confirmOtp(email as string, otp as string);
        if (!confirmOtp) {
            req.flash('error', 'Sai mã, vui lòng nhập lại!!');
            return res.redirect(req.get('referrent') || '/');
        }
        req.session['text'] = email;
        req.flash('success', 'Xác thực mã otp thành công, hãy thay đổi mật khẩu của bạn!')
        res.redirect('/auth/change-password');
    }

    async changePassword(req: Request, res: Response) {
        res.render('client/pages/auth/change-password', {
            titlePage: 'Đổi mật khẩu',
            email: req.session['text'],
        });
    }

    async changePasswordReset(req: Request, res: Response) {
        const {email} = req.query;
        const {password} = req.body;
        const updated = await serviceInstance.changePassword(email as string, password);
        if (!updated) {
            req.flash('error', 'Thay đổi mật khẩu thất bại, vui lòng thử lại!');
            return res.redirect(req.get('referrent') || '/');
        }
        req.flash('success', 'Thay đổi mật khẩu thành công, hãy đăng nhập để hưởng thức âm nhạc!');
        res.redirect('/auth/login');
    }

    async registerPost(req: Request, res: Response) {
        try {
            const { fullName, email, password } = req.body;
            const newUser = await serviceInstance.register(fullName, email, password);
            if (!newUser) {
                req.flash('error', 'Email đã tồn tại, vui lòng tạo bằng email mới!');
                return res.redirect(`/auth/register`);
            }
            req.flash('success', 'Đăng kí thành công, Vui lòng đăng nhập!');
            res.redirect('/auth/login');
        } catch (err) {
            req.flash('error', 'Lỗi server!');
        }
    }

    login(req: Request, res: Response) {
        res.render('client/pages/auth/login', {
            titlePage: 'Trang đăng nhập',
        });
    }

    debug(req: Request, res: Response) {
        res.status(200).json({
            info: req.session,
            user: req.user,
        })
    }

    logout(req: Request, res: Response) {
        req.logout((err) => {
            if (err) return req.flash('error', 'Lỗi xung đột, xin hãy thử lại!');
            res.redirect('/auth/login');
        });
    }
}