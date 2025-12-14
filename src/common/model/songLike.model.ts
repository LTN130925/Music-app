import {Schema, Document, model} from 'mongoose';

export interface ISongLike extends Document {
    listId: Schema.Types.ObjectId[];
}

const songLikeSchema: Schema = new Schema({
    listId: [{type: Schema.Types.ObjectId, ref: 'Song'}],
}, {
    timestamps: true
});

export const SongLikeModel = model<ISongLike>('SongLike', songLikeSchema, 'songsLike');