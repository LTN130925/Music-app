import { SongModel } from "../../common/model/song.model";
import { SingerModel } from "../../common/model/singer.model";
import { TopicModel } from "../../common/model/topic.model";

export const countSongs = async (filter = {}) => {
    return await SongModel.countDocuments(filter);
};

export const countSingers = async (filter = {}) => {
    return await SingerModel.countDocuments(filter);
};

export const countTopics = async (filter = {}) => {
    return await TopicModel.countDocuments(filter);
};
