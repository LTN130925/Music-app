import { Request, Response, NextFunction } from 'express';

import {isValidPassword} from "../../shared/util/isPass.util";

export const dataManagerCreateValidate = (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, roleId } = req.body;

    if (!fullName || fullName.trim() === "") {
        req.flash('error', 'Tên quản lý không được để trống!');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!email || email.trim() === "") {
        req.flash('error', 'Email không được để trống!');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!roleId || roleId.trim() === "") {
        req.flash('error', 'Role không được để trống!');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!password) {
        req.flash('error', 'Mật khẩu không được để trống!');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!isValidPassword(password)) {
        req.flash('error', 'Mật khẩu không đúng định dạng!');
        return res.redirect(req.get('Referrer') || '/');
    }

    next();
};

export const dataManagerUpdateValidate = (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, roleId } = req.body;

    if (!fullName || fullName.trim() === "") {
        req.flash('error', 'Tên quản lý không được để trống!');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!roleId || roleId.trim() === "") {
        req.flash('error', 'Role không được để trống!');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!email || email.trim() === "") {
        req.flash('error', 'Email không được để trống!');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (password) {
        if (!isValidPassword(password)) {
            req.flash('error', 'Mật khẩu không đúng định dạng!');
            return res.redirect(req.get('Referrer') || '/');
        }
    }

    next();
};
