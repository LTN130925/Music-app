import bcrypt from 'bcrypt';

import {UserModel} from '../../../common/model/user.model';
import {SongLikeModel} from '../../../common/model/songLike.model';
import {SongViewModel} from '../../../common/model/songView.model';
import {SongFavouriteModel} from '../../../common/model/songFavourite.model';
import {SubscribersModel} from '../../../common/model/subscribers.model';
import {MassagesModel} from '../../../common/model/message.model';
import {ManagerModel} from '../../../common/model/manager.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model';

export class authService {
    async register(fullName: string, email: string, password: string) {
        const existingUser = await UserModel.findOne({ email, deleted: false });
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
}
