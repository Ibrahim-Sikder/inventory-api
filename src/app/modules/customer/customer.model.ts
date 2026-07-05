import { Schema, model } from 'mongoose';
import { TCustomer } from './customer.interface';

const customerSchema = new Schema<TCustomer>(
    {
        name: { type: String, required: [true, 'Customer name is required'], trim: true },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            trim: true,
        },
        email: { type: String, trim: true, lowercase: true },
        address: { type: String, trim: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export const Customer = model<TCustomer>('Customer', customerSchema);