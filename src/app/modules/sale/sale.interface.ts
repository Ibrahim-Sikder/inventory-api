import { ObjectId } from "mongoose";

export type TSaleItem = {
    product: ObjectId; // Product _id
    quantity: number;
    unitPrice: number; // snapshot of sellingPrice at time of sale
    subtotal: number; // quantity * unitPrice
};

export type TSale = {
    _id?: string;
    customer: Object; // Customer _id
    items: TSaleItem[];
    grandTotal: number;
    createdBy: string; // userId of the admin/manager/employee who made the sale
};

// What the client actually sends — server computes prices/totals itself
// so it can't be tampered with from the frontend.
export type TCreateSalePayload = {
    customer: ObjectId;
    items: { product: string; quantity: number }[];
};