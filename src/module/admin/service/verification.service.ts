import {Types} from "mongoose";

import {IManager, ManagerModel} from "../../../common/model/manager.model";
import {ForgotPassword} from "../../../common/model/forgot.model";
import {BlogUpdatedModel} from "../../../common/model/blog_updated.model";

export class verificationService {
    async verifyOtpChangePassword(otp: string, password: string, email: string, id: Types.ObjectId): Promise<boolean> {
        const verify = await ForgotPassword.findOne({email, otp})
            .lean();
        if (!verify) {
            return false;
        }
        await ManagerModel.findByIdAndUpdate(id, {password: password});
        return true;
    }

    async verifyOtpCreateManager(otp: string, objectData: any, email: string): Promise<boolean> {
        const verify = await ForgotPassword.findOne({email, otp})
            .lean();
        if (!verify) {
            return false;
        }
        const createNewManager = new ManagerModel(objectData);
        await createNewManager.save();
        return true;
    }

    async verifyOtpEditManager(otp: string, objectData: any, manager: IManager): Promise<boolean> {
        const verify = await ForgotPassword.findOne({email: manager.email, otp})
            .lean();
        if (!verify) {
            return false;
        }
        const id = objectData.id;
        delete objectData.id;

        const existing = await ManagerModel.findById(id);
        await BlogUpdatedModel.findByIdAndUpdate(existing.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: "Chỉnh sửa tài khoản quản lý",
                    updatedAt: new Date(),
                },
            },
        });

        await ManagerModel.findByIdAndUpdate(id, objectData);
        return true;
    }
}