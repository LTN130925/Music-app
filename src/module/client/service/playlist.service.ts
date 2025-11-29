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
}