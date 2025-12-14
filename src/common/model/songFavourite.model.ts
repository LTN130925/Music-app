import {Schema, Document, model} from 'mongoose';

export interface ISongFavourite extends Document {
    listId: Schema.Types.ObjectId[];
}

const songFavouriteSchema: Schema = new Schema({
    listId: [{type: Schema.Types.ObjectId, ref: 'Song'}],
}, {
    timestamps: true
});

export const SongFavouriteModel = model<ISongFavourite>('SongFavourite', songFavouriteSchema, 'songsFavourite');