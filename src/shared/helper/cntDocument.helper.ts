import { SongModel } from "../../common/model/song.model";
import { SingerModel } from "../../common/model/singer.model";
import { TopicModel } from "../../common/model/topic.model";
import { ManagerModel } from "../../common/model/manager.model";
import { RoleModel } from "../../common/model/role.model";
import { UserModel } from "../../common/model/user.model";
import {MassagesModel} from "../../common/model/message.model";

export const countSongs = async (filter = {}) => {
    return await SongModel.countDocuments(filter);
};

export const countSingers = async (filter = {}) => {
    return await SingerModel.countDocuments(filter);
};

export const countTopics = async (filter = {}) => {
    return await TopicModel.countDocuments(filter);
};

export const countManagers = async (filter = {}) => {
    return await ManagerModel.countDocuments(filter);
};

export const countUsers = async (filter = {}) => {
    return await UserModel.countDocuments(filter);
};

export const countRoles = async (filter = {}) => {
    return await RoleModel.countDocuments(filter);
};

export const countMessages = async (user) => {
    const doc = await MassagesModel.findById(user.messageId).exec();
    const countUnseen = doc.listId.filter(item => !item.seen).length;
    return countUnseen;
}
