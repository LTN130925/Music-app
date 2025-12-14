import {Schema, Document, model} from 'mongoose';

export interface ISubscriberSchema extends Document {
    listId: Schema.Types.ObjectId[];
}

const subscribersSchema: Schema = new Schema({
    listId: [{type: Schema.Types.ObjectId, ref: 'Singer'}],
}, {
    timestamps: true
});

export const SubscribersModel = model<ISubscriberSchema>('Subscribers', subscribersSchema, 'subscribers');