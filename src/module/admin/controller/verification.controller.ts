import {Request, Response} from 'express';

import {IManager} from "../../../common/model/manager.model";

import {verificationService} from "../service/verification.service";
const serviceInstance = new verificationService();

export class controller {
    otp(req: Request, res: Response) {
        res.render('admin/pages/verification/otp', {
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

    async verificationOtpCreateManager(req: Request, res: Response) {
        const getOtp = req.body['otp'];
        const dataObj = req.session['dataObject'];
        const createManager = await serviceInstance.verifyOtpCreateManager(getOtp, dataObj, req.user['email']);
        if (createManager) {
            delete req.session['dataObject'];
            req.flash('success', 'Tạo tài khoản quản trị thành công!');
        } else {
            req.flash('error', 'Xác thực mã otp thất bại, vui lòng xác thực lại!')
        }
        res.redirect('/server/manager');
    }

    async verificationOtpEditManager(req: Request, res: Response) {
        const getOtp = req.body['otp'];
        const dataObj = req.session['dataObject'];
        const editManager = await serviceInstance.verifyOtpEditManager(getOtp, dataObj, req.user as IManager);
        if (editManager) {
            delete req.session['dataObject'];
            req.flash('success', 'Cập nhật tài khoản quản trị thành công!');
        } else {
            req.flash('error', 'Xác thực mã otp thất bại, vui lòng xác thực lại!')
        }
        res.redirect('/server/manager');
    }
}