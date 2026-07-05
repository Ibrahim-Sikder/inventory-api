export type TProduct = {
    _id?: string;
    name: string;
    sku: string;
    category: string;
    purchasePrice: number;
    sellingPrice: number;
    stockQuantity: number;
    image: string; // stored file path / URL
    isDeleted: boolean;
};