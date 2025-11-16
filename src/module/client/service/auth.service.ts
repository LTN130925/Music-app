import bcrypt from 'bcrypt';

import {UserModel} from '../../../common/model/user.model';
import {SongLikeModel} from '../../../common/model/songLike.model';
import {SongViewModel} from '../../../common/model/songView.model';
import {SongFavouriteModel} from '../../../common/model/songFavourite.model';
import {SubscribersModel} from '../../../common/model/subscribers.model';
import {MassagesModel} from '../../../common/model/message.model';

export class authService {
    async register(fullName: string, email: string, password: string) {
        const existingUser = await UserModel.findOne({ email, deleted: false });
        if (existingUser) return null;

        const hashedPassword = await bcrypt.hash(password, 10);
        const [newSongView, newSongFavourite, newSongLike, newSubscribers, newMassage] = await Promise.all([
            new SongViewModel().save(),
            new SongFavouriteModel().save(),
            new SongLikeModel().save(),
            new SubscribersModel().save(),
            new MassagesModel().save(),
        ]);

        const newUser = new UserModel({
            fullName,
            email,
            password: hashedPassword,
            listLikesSong: newSongLike._id,
            listFavoritesSong: newSongFavourite._id,
            listViewsSong: newSongView._id,
            subscribers: newSubscribers._id,
            messageId: newMassage._id,
        });
        await newUser.save();

        return newUser;
    }
}
