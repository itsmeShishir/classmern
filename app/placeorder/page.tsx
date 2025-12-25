"use client"

import {useState, useEffect} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../redux/hook'
import { clearCartItems } from '../redux/slice/cartSlice'
import CheckoutSteps from '../component/CheckoutSteps'
import api from '../utils/axios'
import axios from 'axios'
import {toast} from 'react-toastify'
import { esewaCAll } from '../utils/esewa'


const PlaceOrderPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const cart = useAppSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);

    // Redirect if logic messing
    useEffect(()=>{
        if(!cart.shippingAddress){
            router.push("/shipping");
        }else if(!cart.paymentMethod){
            router.push("/payment");
        }
    }, [cart, router]);

    const placeOrderHandler = async() => {
        setLoading(true);
        try{
            const {data:order} = await api.post("/orders", {
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: Number(cart.itemsPrice),
                shippingPrice: Number(cart.shippingPrice),
                taxPrice: Number(cart.taxPrice),
                totalPrice: Number(cart.totalPrice),
            });

            //clearn cart
            dispatch(clearCartItems());

            // handling payment methods
            if(cart.paymentMethod === "esewa"){
                await handleEsewaPayment(order._id, order.totalPrice);
            }else if(cart.paymentMethod === "khalti"){
                await handleKhaltiPayment(order._id, order.totalPrice);
            }else if(cart.paymentMethod === "cod"){
                toast.success("Order placed successfully");
                router.push(`/order/${order._id}`);
            }
        }catch(e: any){
            toast.error(e.response?.data?.message || e.message);
            setLoading(false);
        }
    }

    const handleEsewaPayment = async(orderId: string, totalPrice: number) => {
        try{
            const {data} = await api.post("/api/payment/esewa/initialize", {
                orderId,
                totalPrice,
            });
            // 2. submit hiddemn form
            esewaCAll({
                url: data.url,
                signature: data.signature,
                uuid: data.uuid,
                product_code: data.product_code,
                total_amount: data.total_amount,
                success_url: data.success_url,
                failure_url: data.failure_url,
            });

        }catch(e: any){
            toast.error("eSewa payment error");
        }finally{
            setLoading(false);
        }
    }

    const handleKhaltiPayment = async(orderId: string, totalPrice: number) => {
        try{
            const {data} = await api.post("/api/payment/khalti/initialize", {
                orderId,
                totalPrice,
                website_url: window.location.origin,
            });
            if(data.payment_url){
                window.location.href = data.payment_url;
            }else{
                toast.error("Khalti payment error");
            }
        }catch(e: any){
            toast.error("Khalti payment error");
        }finally{
            setLoading(false);
        }
    }

  return (
    <div className='container mx-auto my-10'>
        <CheckoutSteps step1 step2 step3 step4/>
        <h1 className='text-2xl font-bold mb-6'>Place Order</h1>
        <div className='grid md:grid-cols-4 md:gap-6'>
            <div className='md:col-span-3 space-y-6'>
                {/* Shipping Address */}
                <div className='border p-4 rounded'>
                    <h2 className='text-lg font-semibold mb-2'>Shipping Address</h2>
                    <p>
                        {cart.shippingAddress?.address}, {cart.shippingAddress?.city}, {cart.shippingAddress?.postalCode}, {cart.shippingAddress?.country}
                    </p>
                    <Link href="/shipping" className='text-blue-500 hover:underline'>Edit</Link>
                </div>
                {/* Payment Method */}
                <div className='border p-4 rounded'>
                    <h2 className='text-lg font-semibold mb-2'>Payment Method</h2>
                    <p>{cart.paymentMethod}</p>
                    <Link href="/payment" className='text-blue-500 hover:underline'>Edit</Link>
                </div> 
                {/* Order Items */}
                <div className='border p-4 rounded'>
                    <h2 className='text-lg font-semibold mb-2'>Order Items</h2>
                    {cart.cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <div>
                            {cart.cartItems.map((item) => (
                                <div key={item._id} className='flex items-center justify-between mb-4'>
                                    <div className='flex items-center'>
                                        <Image src={item.image} alt={item.name} width={50} height={50} className='object-cover'/>
                                        <Link href={`/products/${item._id}`} className='ml-4 text-lg font-medium'>{item.name}</Link>
                                    </div>
                                    <span>{item.qty} x ${item.price} = ${item.qty * item.price}</span>
                                </div>
                            ))}
                            <Link href="/cart" className='text-blue-500 hover:underline'>View Cart</Link>
                        </div>
                    )}
                </div>
            </div>
            {/* Order Summary */}
            <div className='border p-4 rounded h-fit'>
                <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>
                <div className='flex justify-between mb-2'>
                    <span>Items:</span>
                    <span>${cart.itemsPrice}</span>
                </div>
                <div className='flex justify-between mb-2'>
                    <span>Shipping:</span>
                    <span>${cart.shippingPrice}</span>
                </div>
                <div className='flex justify-between mb-2'>
                    <span>Tax:</span>
                    <span>${cart.taxPrice}</span>
                </div>
                <div className='flex justify-between font-bold text-lg mb-4'>
                    <span>Total:</span>
                    <span>${cart.totalPrice}</span>
                </div>
                <button 
                    onClick={placeOrderHandler} 
                    disabled={cart.cartItems.length === 0 || loading}
                    className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400'
                >
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </div>  
      
    </div>
  )
}

export default PlaceOrderPage
