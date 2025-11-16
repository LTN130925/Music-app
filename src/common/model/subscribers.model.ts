import {Schema, Document, model} from 'mongoose';

export interface ISubscriberSchema extends Document {
    listId: string[];
}

const subscribersSchema: Schema = new Schema({
    listId: {
        type: [String],
        default: []
    },
}, {
    timestamps: true
});

export const SubscribersModel = model<ISubscriberSchema>('Subscribers', subscribersSchema, 'subscribers');