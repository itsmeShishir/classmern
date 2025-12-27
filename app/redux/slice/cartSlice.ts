import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/app/types";

interface ShippingAddress{
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
}

interface CartState{
    cartItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice:string,
    shippingPrice:string,
    taxPrice:string,
    totalPrice:string,
}



// helper function 
const addDecimal = (num: number) =>{
    return (Math.round(num * 100) / 100).toFixed(2);
}

const emptyAddress: ShippingAddress = {
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
};

const normalizeCartItem = (raw: CartItem): CartItem => {
    const stock = (raw as any).countInStock ?? (raw as any).countonstock ?? (raw as any).stock ?? 0;
    const safeStock = Number.isFinite(stock) && stock > 0 ? stock : raw.qty ?? 1;
    const qty = Math.min(raw.qty ?? 1, safeStock);
    return {
        ...raw,
        countInStock: safeStock,
        numReviews: (raw as any).numReviews ?? (raw as any).numRating ?? raw.numReviews ?? 0,
        qty: qty > 0 ? qty : 1,
    };
};

const getCartFromStorage = (): CartState =>{
    if(typeof window !== 'undefined'){
        try{
            const cart = localStorage.getItem('cart');
            if(cart){
                const parsed = JSON.parse(cart);
                return {
                    cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems.map((item: CartItem) => normalizeCartItem(item)) : [],
                    shippingAddress: parsed.shippingAddress ?? emptyAddress,
                    paymentMethod: parsed.paymentMethod ?? 'esewa',
                    itemsPrice: parsed.itemsPrice ?? '0',
                    shippingPrice: parsed.shippingPrice ?? '0',
                    taxPrice: parsed.taxPrice ?? '0',
                    totalPrice: parsed.totalPrice ?? '0',
                };
            }
        }catch{
        }
        return {
            cartItems: [],
            shippingAddress: emptyAddress,
            paymentMethod: 'esewa',
            itemsPrice: '0',
            shippingPrice: '0',
            taxPrice: '0',
            totalPrice: '0',
        };
    }
    return {
            cartItems: [],
            shippingAddress: emptyAddress,
            paymentMethod: 'esewa',
            itemsPrice: '0',
            shippingPrice: '0',
            taxPrice: '0',
            totalPrice: '0',

    }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: getCartFromStorage(),
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = normalizeCartItem(action.payload);
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if(existItem){
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x);
            }else{
                state.cartItems = [...state.cartItems, item];
            }
            const itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
            state.itemsPrice = addDecimal(itemsPrice);

            const shippingPrice = itemsPrice > 1000 ? 0 : 100;
            state.shippingPrice = addDecimal(shippingPrice);


            const taxPrice =  Number((0.13 * itemsPrice).toFixed(2));
            state.taxPrice = addDecimal(taxPrice);


            state.totalPrice = addDecimal(itemsPrice+shippingPrice+taxPrice);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action: PayloadAction<string>) =>{
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

            const itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
            state.itemsPrice = addDecimal(itemsPrice);

            const shippingPrice = itemsPrice > 1000 ? 0 : 100;
            state.shippingPrice = addDecimal(shippingPrice);

            const taxPrice =  Number((0.13 * itemsPrice).toFixed(2));
            state.taxPrice = addDecimal(taxPrice);

            state.totalPrice = addDecimal(itemsPrice+shippingPrice+taxPrice);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        saveShippingAddress:(state, action: PayloadAction<ShippingAddress>)=>{
            state.shippingAddress = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        savePaymentMethod:(state, action: PayloadAction<string>)=>{
            state.paymentMethod = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearCartItems:(state)=>{
            state.cartItems = [];
            state.itemsPrice = '0';
            state.shippingPrice = '0';
            state.taxPrice = '0';
            state.totalPrice = '0';
            localStorage.setItem('cart', JSON.stringify(state));
        }
    }
})

export const {addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems} = cartSlice.actions;
export default cartSlice.reducer;
