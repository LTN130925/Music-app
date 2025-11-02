import { SongLikeModel } from "../../common/model/songLike.model.js";
import { SingerModel } from "../../common/model/singer.model.js";
import { TopicModel } from "../../common/model/topic.model.js";

const filter = { deleted: false, status: 'active' };

// @ts-ignore
const [songs, singers, topics] = await Promise.all([
    SongLikeModel.countDocuments(filter),
    SingerModel.countDocuments(filter),
    TopicModel.countDocuments(filter)
]);

export const countSong = () => songs;
export const countSinger = () => singers;
export const countTopic = () => topics;
