export interface Product {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    category: string;
}

export interface CartItem extends Product {
    quantity: number;
}
