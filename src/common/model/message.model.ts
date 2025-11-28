import { Schema, Document, model } from 'mongoose';

export interface IListItem {
    singer: Schema.Types.ObjectId;
    title: string;
    seen: boolean;
    description: string;
    link: string;
}

export interface IMassage extends Document {
    listId: IListItem[];
    createdAt?: Date;
    updatedAt?: Date;
}

const MassageSchema = new Schema<IMassage>(
    {
        listId: {
            type: [
                {
                    singer: { type: Schema.Types.ObjectId, ref: 'Singer' },
                    seen: { type: Boolean, default: false },
                    title: { type: String, required: true },
                    link: { type: String, required: true },
                    description: { type: String, required: true }
                }
            ],
            default: []
        },
    },
    { timestamps: true }
);

export const MassagesModel = model<IMassage>('Massage', MassageSchema, 'message');
