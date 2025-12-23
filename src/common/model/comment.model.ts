import {Schema, model} from 'mongoose';

export interface IComment {
    _id: Schema.Types.ObjectId;

    song_id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;

    content: string;

    parent_id?: Schema.Types.ObjectId | null;

    likes: Schema.Types.ObjectId[];
    dislikes: Schema.Types.ObjectId[];

    likesCount: number;
    dislikesCount: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface CommentResponse {
    id: string;
    author: string;
    replyTo?: string | null;
    content: string;
    createdAt: Date;
    likesCount: number;
    dislikesCount: number;
    isLiked: boolean;
    isDisliked: boolean;
    replies: CommentResponse[];
}

const CommentSchema = new Schema(
    {
        song_id: {
            type: Schema.Types.ObjectId,
            ref: 'Song',
            required: true,
        },

        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        parent_id: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null
        },

        likes: [{type: Schema.Types.ObjectId, ref: 'User'}],

        dislikes: [{type: Schema.Types.ObjectId, ref: 'User'}],

        likesCount: {
            type: Number,
            default: 0,
            index: true
        },

        dislikesCount: {
            type: Number,
            default: 0,
            index: true
        }
    },
    {timestamps: true}
);

CommentSchema.index({song_id: 1, createdAt: -1});
CommentSchema.index({parent_id: 1, createdAt: -1});

export const CommentModel = model('Comment', CommentSchema, 'comments');
