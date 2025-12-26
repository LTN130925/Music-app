import {Request, Response} from 'express';

import {verificationService} from "../service/verification.service";
const serviceInstance = new verificationService();

export class controller {
    otp(req: Request, res: Response) {
        res.render('client/pages/verification/otp', {
            titlePage: 'Xác thực otp thay đổi mật khẩu!',
            path: req.session['path'],
        });
    }

    async verificationOtpChangePassword(req: Request, res: Response) {
        const getPassword = req.session['text'];
        const getOtp = req.body['otp'];
        const verify = await serviceInstance.verifyOtpChangePassword(getOtp, getPassword, req.user['email'], req.user['_id']);
        if (verify) {
            delete req.session['text'];
            req.flash('success', 'xác thực mã otp thành công, mật khẩu của bạn đã được cập nhật!');
        } else {
            req.flash('error', 'Xác thực mã otp thất bại, vui lòng xác thực lại!')
        }
        res.redirect(req.get('Referrer') || '/');
    }
}