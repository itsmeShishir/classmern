"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '../redux/hook'
import { saveShippingAddress } from '../redux/slice/cartSlice'
import CheckoutSteps from '../component/CheckoutSteps'


const ShippingAddressPage = () => {
    const {shippingAddress} = useAppSelector((state) => state.cart);
    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const [phoneNumber, setPhoneNumber] = useState(shippingAddress?.phoneNumber || '');

    const dispatch = useAppDispatch();
    const router = useRouter();

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        // dispatch a redux action to save shipping address
        dispatch(saveShippingAddress({address, city, postalCode, country, phoneNumber}));
        router.push("/payment");
    }
  return (
    <div className='max-w-xl mx-auto mt-10'>
        <CheckoutSteps step1 step2 />
        <h1 className='text-2xl font-bold mb-6'>Shipping Address</h1>
        <form onSubmit={submitHandler} className='space-y-4'>
            <div>
                <label className='block mb-1 font-medium'>Address</label>
                <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required    
                    className='w-full border rounded p-2'
                />
            </div>
            <div>
                <label className='block mb-1 font-medium'>City</label>
                <input 
                    type="text"

                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required    
                    className='w-full border rounded p-2'
                />
            </div>
            <div>
                <label className='block mb-1 font-medium'>Postal Code</label>
                <input 
                    type="text" 
                    value={postalCode} 
                    onChange={(e) => setPostalCode(e.target.value)} 
                    required    
                    className='w-full border rounded p-2'
                />
            </div>
            <div>
                <label className='block mb-1 font-medium'>Country</label>
                <input 
                    type="text" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    required    
                    className='w-full border rounded p-2'
                />
            </div>
            <div>
                <label className='block mb-1 font-medium'>Phone Number</label>
                <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    required    
                    className='w-full border rounded p-2'
                />
            </div>
            <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                Continue
            </button>
        </form>
    </div>
  )
}

export default ShippingAddressPage
