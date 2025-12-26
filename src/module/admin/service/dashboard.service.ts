import {UserModel} from "../../../common/model/user.model";
import {SongModel} from "../../../common/model/song.model";
import {SingerModel} from "../../../common/model/singer.model";
import {TopicModel} from "../../../common/model/topic.model";
import {ManagerModel} from "../../../common/model/manager.model";
import {SongLikeModel} from "../../../common/model/songLike.model";
import {SongViewModel} from "../../../common/model/songView.model";
import {SubscribersModel} from "../../../common/model/subscribers.model";

export class dashboardService {
    async index() {
        const [
            totalUsers,
            totalSongs,
            totalSingers,
            totalTopics,
            totalManagers,
            likesDocs,
            viewsDocs,
            subscribersDocs,
            latestUsers,
            topSongs,
            topSingers,
            topTopics
        ] = await Promise.all([
            UserModel.countDocuments({ deleted: false }),
            SongModel.countDocuments({ deleted: false }),
            SingerModel.countDocuments({ deleted: false }),
            TopicModel.countDocuments({ deleted: false }),
            ManagerModel.countDocuments({ deleted: false }),

            SongLikeModel.find(),
            SongViewModel.find(),
            SubscribersModel.find(),

            UserModel.find({ deleted: false })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('fullName email createdAt'),

            SongModel.find({ deleted: false })
                .sort({ views: -1 })
                .limit(10)
                .select('title views likes'),

            SingerModel.find({ deleted: false })
                .sort({registrationNumber: -1})
                .limit(10)
                .select('fullName registrationNumber'),

            TopicModel.find({deleted: false})
                .sort({createdAt: -1})
                .limit(10)
                .select('title')
        ]);

        const totalLikes = likesDocs.reduce((sum, doc) => sum + doc.listId.length, 0);
        const totalViews = viewsDocs.reduce((sum, doc) => sum + doc.listId.length, 0);
        const totalSubscribers = subscribersDocs.reduce((sum, doc) => sum + doc.listId.length, 0);

        return {
            stats: {
                totalUsers,
                totalSongs,
                totalSingers,
                totalTopics,
                totalManagers,
                totalLikes,
                totalViews,
                totalSubscribers
            },
            latestUsers,
            topSongs,
            topSingers,
            topTopics
        }
    }
}