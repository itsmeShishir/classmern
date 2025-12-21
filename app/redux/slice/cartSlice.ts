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

// Load initial state from localStorage 
const getCartFromStorage = (): CartState =>{
    if(typeof window !== 'undefined'){
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : {
            cartItems: [],
            shippingAddress:{},
            paymentMethod: 'esewa',
            itemsPrice: '0',
            shippingPrice: '0',
            taxPrice: '0',
            totalPrice: '0',
        };
    }
    return {
            cartItems: [],
            shippingAddress:{} as ShippingAddress,
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
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if(existItem){
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x);
            }else{
                state.cartItems = [...state.cartItems, item];
            }
            //calculate Pice
            const itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
            state.itemsPrice = addDecimal(itemsPrice);

            // shipping price 1000> free if <1000 100
            const shippingPrice = itemsPrice > 1000 ? 0 : 100;
            state.shippingPrice = addDecimal(shippingPrice);


            // tax price -> 13%
            const taxPrice =  Number((0.13 * itemsPrice).toFixed(2));
            state.taxPrice = addDecimal(taxPrice);


            // total price 
            state.totalPrice = addDecimal(itemsPrice+shippingPrice+taxPrice);

            // loclastorage
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action: PayloadAction<string>) =>{
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

            //Recalculate total
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