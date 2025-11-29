import {SongLikeModel} from '../../../common/model/songLike.model';
import {SongModel} from '../../../common/model/song.model';

export class playlistLikeService {
    async getListSong(user) {
        const record = await SongLikeModel.findById(user.listLikesSong).exec();
        const playlistLikeSongs = await SongModel.find({
            _id: { $in: record.listId },
            deleted: false,
            status: 'active'
        })
            .populate('singerId', 'fullName')
            .exec();
        return playlistLikeSongs;
    }

    async favourite(user) {
        try {
            const filter = {
                _id: user.listFavoritesSong['listId'],
                deleted: false,
                status: 'active',
            };
            const songs = await SongModel.find(filter)
                .select('title avatar singerId slug createdAt')
                .populate('singerId', 'fullName')
                .exec();

            return songs;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}