"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '../redux/hook'
import { addToCart, removeFromCart } from '../redux/slice/cartSlice'
import { FaTrash } from 'react-icons/fa'

const CartPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {cartItems, totalPrice, itemsPrice, taxPrice} = useAppSelector((state) => state.cart);

    const addToCartHandler = (product : any, qty: number) => {
        dispatch(addToCart({...product, qty}));
    }
    
    const removeFromCartHandler = (id: string) => {
        dispatch(removeFromCart(id));
    }

    const checkoutHandler = () => {
        // Shipping address page
        router.push("/login?redirect=shipping");
    }


  return (
    <div className='container mx-auto py-8'>
        <h1 className='text-3xl font-bold mb-8'> Shopping Cart </h1>

        {cartItems.length === 0 ? (
            <div>
                Your cart is empty. <Link href="/products" className='text-blue-500 underline'>Go Back</Link>
            </div>
        ) : (
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='md:col-span-3'>
                    {cartItems.map((item) => (
                        <div key={item._id} className='flex items-center border-b py-4'>
                            <Image src={item.image} alt={item.name} width={80} height={80} className='object-cover'/>
                            <Link href={`/products/${item._id}`} className='ml-4 text-lg font-medium'>{item.name}</Link>
                            <select 
                                value={item.qty} 
                                onChange={(e) => addToCartHandler(item, Number(e.target.value))} 
                                className='ml-4 border rounded p-2'
                            >
                                {[...Array(item.countInStock).keys()].map((x) => (
                                    <option key={x+1} value={x+1}>{x+1}</option>
                                ))}
                            </select>
                            <span className='ml-4 font-medium'>${item.price}</span>
                            <button 
                                onClick={() => removeFromCartHandler(item._id)} 
                                className='ml-4 text-red-500 hover:text-red-700'
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
                <div className='border p-4'>
                    <h2 className='text-xl font-bold mb-4'>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</h2>
                    <p className='mb-2'>Items Price: ${itemsPrice}</p>
                    <p className='mb-2'>Tax Price: ${taxPrice}</p>
                    <p className='font-bold mb-4'>Total Price: ${totalPrice}</p>
                    <button 
                        onClick={checkoutHandler} 
                        className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        )}
      
    </div>
  )
}

export default CartPage
