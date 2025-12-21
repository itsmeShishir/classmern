export interface User{
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    token: string;
    avatar?: string;

}

export interface Product{
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    brand: string;
    countInStock: number;
    rating: number;
    numReviews: number;
}

export interface CartItem extends Product{
    qty: number;
}
