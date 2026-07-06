
import { Types } from 'mongoose';

export type TSaleItem = {
    product: Types.ObjectId | string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
};

export type TSale = {
    _id?: string;
    customer: Types.ObjectId | string;
    items: TSaleItem[];
    grandTotal: number;
    createdBy: string;
};

export type TCreateSalePayload = {
    customer: string;
    items: { product: string; quantity: number }[];
};