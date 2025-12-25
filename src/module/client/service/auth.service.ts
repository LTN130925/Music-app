import bcrypt from 'bcrypt';

import {UserModel} from '../../../common/model/user.model';
import {SongLikeModel} from '../../../common/model/songLike.model';
import {SongViewModel} from '../../../common/model/songView.model';
import {SongFavouriteModel} from '../../../common/model/songFavourite.model';
import {SubscribersModel} from '../../../common/model/subscribers.model';
import {MassagesModel} from '../../../common/model/message.model';
import {ManagerModel} from '../../../common/model/manager.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model';
import {ForgotPassword} from "../../../common/model/forgot.model";

import { generateRandom } from "../../../shared/util/generateRandom";
import {sendMail} from "../../../shared/util/sendMail.util";
import {objectSentMailDataClient} from "../../../common/data/objectSentMail.data";

export class authService {
    async register(fullName: string, email: string, password: string) {
        const existingUser = await UserModel.findOne({email, deleted: false});
        if (existingUser) return null;

        const hashedPassword = await bcrypt.hash(password, 10);
        const [newSongView, newSongFavourite, newSongLike, newSubscribers, newMassage, newBlogUpdated] = await Promise.all([
            new SongViewModel().save(),
            new SongFavouriteModel().save(),
            new SongLikeModel().save(),
            new SubscribersModel().save(),
            new MassagesModel().save(),
            new BlogUpdatedModel().save(),
        ]);
        const manager = await ManagerModel.find({deleted: false, status: 'active'})
            .select('roleId')
            .populate('roleId', 'role')
            .exec();
        const managerUserId = manager.reduce((array, objectM) => {
            if (objectM.roleId && ['admin-server', 'admin-user'].includes(objectM['roleId']['role']))
                array.push(objectM._id);
            return array;
        }, []);

        const newUser = new UserModel({
            fullName,
            email,
            password: hashedPassword,
            listLikesSong: newSongLike._id,
            listFavoritesSong: newSongFavourite._id,
            listViewsSong: newSongView._id,
            subscribers: newSubscribers._id,
            messageId: newMassage._id,
            managerUser: managerUserId,
            updatedBlogId: newBlogUpdated._id,
        });
        await newUser.save();
        return newUser;
    }

    async confirmEmail(email) {
        const findUser = await UserModel.findOne({email: email, deleted: false}).exec();
        if (!findUser) return null;

        const object: any = {
            email: findUser.email,
            otp: generateRandom.typeNumber(6),
        };
        const forgotPassword = new ForgotPassword(object);
        await forgotPassword.save();

        const objectSendMail: any = objectSentMailDataClient(forgotPassword);

        sendMail(objectSendMail);
        return 'success';
    }

    async confirmOtp(email: string, otp: string) {
        const findOtp = await ForgotPassword.find({email: email, otp: otp});
        if (!findOtp) return null;
        return 'success';
    }

    async changePassword(email: string, password: string) {
        const user = await UserModel.updateOne({email: email}, {password: await bcrypt.hash(password, 10)});
        if (!user) return null;
        return 'success';
    }
}
