import mongoose from 'mongoose';

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: {
        type: String,
        default: '',
    },
    expireAt: {
        type: Date,
        default: Date.now,
    },
});

forgotPasswordSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 });

export const ForgotPassword = mongoose.model(
    'ForgotPassword',
    forgotPasswordSchema,
    'forgot-password'
);

