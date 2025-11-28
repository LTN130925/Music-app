import {SongModel} from "../../../common/model/song.model";
import {MassagesModel} from "../../../common/model/message.model";

export class notificationsService {
    async setting(slug, user) {
        const song = await SongModel
            .findOne({slug})
            .populate('singerId', 'fullName')
            .exec();

        await MassagesModel.updateOne(
            {_id: user.messageId, 'listId.singer': song.singerId},
            {$set: {'listId.$.seen': true}}
        )
    }
}