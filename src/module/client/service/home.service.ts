import {SongModel} from "../../../common/model/song.model";
import {SingerModel} from "../../../common/model/singer.model";
import {TopicModel} from "../../../common/model/topic.model";

export class homeService {
    async home() {
        const filter = {deleted: false, status: 'active'}
        // @ts-ignore
        const [songsNew, songsHot, playlists, singers, recommended] = await Promise.all([
            SongModel.find(filter).populate('singerId', 'fullName').sort({createdAt: -1}).limit(5).exec(),
            SongModel.find(filter).populate('singerId', 'fullName').limit(5).exec(),
            TopicModel.find(filter).limit(5).exec(),
            SingerModel.find(filter).limit(5).exec(),
            SongModel.find(filter).sort({views: -1}).populate('singerId', 'fullName').limit(5).exec(),
        ]);
        return {
            songsNew,
            songsHot,
            playlists,
            singers,
            recommended
        }
    }
}