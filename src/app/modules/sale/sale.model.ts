import { Schema, model } from 'mongoose';
import { TSale, TSaleItem } from './sale.interface';

const saleItemSchema = new Schema<TSaleItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
        unitPrice: { type: Number, required: true, min: 0 },
        subtotal: { type: Number, required: true, min: 0 },
    },
    { _id: false },
);

const saleSchema = new Schema<TSale>(
    {
        customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
        items: {
            type: [saleItemSchema],
            required: true,
            validate: {
                validator: (items: TSaleItem[]) => items.length > 0,
                message: 'A sale must contain at least one product',
            },
        },
        grandTotal: { type: Number, required: true, min: 0 },
        createdBy: { type: String, required: true }, // custom userId, e.g. "002"
    },
    { timestamps: true },
);

export const Sale = model<TSale>('Sale', saleSchema);