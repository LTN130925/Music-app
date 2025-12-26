import {Types} from "mongoose";

import {UserModel} from "../../../common/model/user.model";
import {ForgotPassword} from "../../../common/model/forgot.model";

export class verificationService {
    async verifyOtpChangePassword(otp: string, password: string, email: string, id: Types.ObjectId): Promise<boolean> {
        const verify = await ForgotPassword.findOne({email, otp})
            .lean();
        if (!verify) {
            return false;
        }
        await UserModel.findByIdAndUpdate(id, {password: password});
        return true;
    }
}