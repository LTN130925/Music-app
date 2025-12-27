import {Request, Response, NextFunction} from "express";

import {SettingModel} from "../model/general-setting.model";

export const generalSettingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const setting = await SettingModel.findOne();
    if (setting.maintenance) {
        return res.redirect("/maintenance");
    }
    res.locals.setting = setting;
    next();
}