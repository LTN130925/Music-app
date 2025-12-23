import { Types } from 'mongoose';

import {CommentModel} from "../../../common/model/comment.model";

import {IComment} from "../../../common/model/comment.model";
import {CommentResponse} from "../../../common/model/comment.model";

import {getChildAndParentComments} from '../../../shared/logic/getChildAndParentComments';

export class commentService {
    async getListComments(idSong: string, userId: Types.ObjectId): Promise<CommentResponse[]> {
        const comments: IComment[] = await CommentModel
            .find({ song_id: idSong })
            .sort({ createdAt: -1 })
            .populate('user_id', 'fullName')
            .lean<IComment[]>()
            .exec();
        if (!comments.length) return [];

        const logic = new getChildAndParentComments(comments, userId);
        const data = logic.getComments();
        return data;
    }

    async addComment(songId: string, userId: Types.ObjectId, content: string, parentId?: string) {
        const commentData = {
            song_id: new Types.ObjectId(songId),
            user_id: userId,
            content,
            parent_id: parentId ? new Types.ObjectId(parentId) : undefined,
        };

        const newComment = await CommentModel.create(commentData);
        return newComment.toObject();
    }

}