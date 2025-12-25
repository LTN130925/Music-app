import {Types} from "mongoose";
import bcrypt from 'bcrypt';

import {ManagerModel} from "../../../common/model/manager.model";
import {generateRandom} from "../../../shared/util/generateRandom";
import {ForgotPassword} from "../../../common/model/forgot.model";
import {objectSentMailDataServer} from "../../../common/data/objectSentMail.data";
import {sendMail} from "../../../shared/util/sendMail.util";

export class ProfileService {
    async editPatch(body: any, userId: Types.ObjectId): Promise<any> {
        const editProfile = await ManagerModel.findByIdAndUpdate(userId, body);
        return editProfile;
    }

    async cypherPassword(password: string, email: string): Promise<string> {
        const cypher = await bcrypt.hash(password, 10);
        const object: any = {
            email: email,
            otp: generateRandom.typeNumber(6),
        };
        const forgotPassword = new ForgotPassword(object);
        await forgotPassword.save();

        const objectSendMail: any = objectSentMailDataServer(forgotPassword);

        sendMail(objectSendMail);
        return cypher;
    }

    async verifiOtp(otp: string, password: string, email: string, id: Types.ObjectId): Promise<boolean> {
        const verify = await ForgotPassword.findOne({email, otp})
            .lean();
        if (!verify) {
            return false;
        }
        await ManagerModel.findByIdAndUpdate(id, {password: password});
        return true;
    }
}