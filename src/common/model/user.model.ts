import {Schema, Document, model} from 'mongoose';

export interface IUser extends Document {
    fullName: string;
    password: string;
    email: string;
    avatar?: string;
    phone?: string;
    listLikesSong: Schema.Types.ObjectId;
    listFavoritesSong: Schema.Types.ObjectId;
    listViewsSong: Schema.Types.ObjectId;
    subscribers: Schema.Types.ObjectId;
    messageId: Schema.Types.ObjectId;
    updatedBlogId?: Schema.Types.ObjectId;
    deletedBy?: {managerId: Schema.Types.ObjectId, at: Date};
    status?: 'active' | 'inactive';
    deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        fullName: { type: String, required: true },
        password: { type: String, required: true },
        phone: { type: String, default: '' },
        email: { type: String, required: true },
        avatar: { type: String },
        listLikesSong: { type: Schema.Types.ObjectId, ref: 'SongLike' },
        listFavoritesSong: { type: Schema.Types.ObjectId, ref: 'SongFavourite' },
        listViewsSong: { type: Schema.Types.ObjectId, ref: 'SongView' },
        subscribers: { type: Schema.Types.ObjectId, ref: 'Subscribers' },
        updatedBlogId: {type: Schema.Types.ObjectId, ref: 'BlogUpdated'},
        messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
        deletedBy: {
            managerId: {type: Schema.Types.ObjectId, ref: 'Manager'},
            at: { type: Date, default: Date.now },
        },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema, 'users');
