import { Schema, Document, model } from 'mongoose';

export interface IListItem {
    singer: string;
    title: string;
    description: string;
}

export interface IMassage extends Document {
    listId: IListItem[];
    seen: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const MassageSchema = new Schema<IMassage>(
    {
        listId: {
            type: [
                {
                    singer: { type: String, required: true },
                    title: { type: String, required: true },
                    description: { type: String, required: true }
                }
            ],
            default: []
        },
        seen: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const MassagesModel = model<IMassage>('Massage', MassageSchema, 'message');
