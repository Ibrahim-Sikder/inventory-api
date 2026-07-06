export type TProduct = {
    _id?: string;
    name: string;
    sku: string;
    category: string;
    purchasePrice: number;
    sellingPrice: number;
    stockQuantity: number;
    images: [string];
    isDeleted: boolean;
};