import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>(
    {
        name: { type: String, required: [true, 'Product name is required'], trim: true },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            trim: true,
            uppercase: true,
        },
        category: { type: String, required: [true, 'Category is required'], trim: true },
        purchasePrice: {
            type: Number,
            required: [true, 'Purchase price is required'],
            min: [0, 'Purchase price cannot be negative'],
        },
        sellingPrice: {
            type: Number,
            required: [true, 'Selling price is required'],
            min: [0, 'Selling price cannot be negative'],
        },
        stockQuantity: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock quantity cannot be negative'],
            default: 0,
        },
        image: { type: String, required: [true, 'Product image is required'] },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

// Note: isDeleted:false filtering is applied explicitly in product.service.ts
// (kept out of a global pre-hook so it composes predictably with QueryBuilder).

export const Product = model<TProduct>('Product', productSchema);