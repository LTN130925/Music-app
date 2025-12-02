import { Schema, Document, model } from 'mongoose';

interface ObjectView {
    idSong: Schema.Types.ObjectId;
    at: Date;
}

export interface ISongView extends Document {
    listId: ObjectView[];
}

const songViewSchema: Schema = new Schema({
    listId: [
        {
            idSong: { type: Schema.Types.ObjectId, ref: 'Song' },
            at: { type: Date, default: new Date() },
        }
    ]
}, { timestamps: true });

export const SongViewModel = model<ISongView>('SongView', songViewSchema, 'songsView');
