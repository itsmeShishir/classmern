"use client"
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../redux/hook'
import { savePaymentMethod } from '../redux/slice/cartSlice'
import CheckoutSteps from '../component/CheckoutSteps'

const page = () => {
    const [paymentMethod, setPaymentMethod] = useState('esewa');

    const dispatch = useAppDispatch();
    const router = useRouter();

    const {shippingAddress} = useAppSelector((state) => state.cart);

    useEffect(() => {
        if(!shippingAddress) {
            router.push("/shipping");
        }
    }, [shippingAddress, router]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        router.push("/placeorder");
    }
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <h1 className='text-2xl font-bold mb-6'>Payment Method</h1>
      <form onSubmit={submitHandler} className='space-y-4'>
        <div>
          <input 
            type="radio" 
            id="esewa" 
            name="paymentMethod" 
            value="esewa" 
            checked={paymentMethod === 'esewa'} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
          />
          <label htmlFor="esewa" className='ml-2'>eSewa</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="khalti" 
            name="paymentMethod" 
            value="khalti" 
            checked={paymentMethod === 'khalti'} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
          />
          <label htmlFor="khalti" className='ml-2'>Khalti</label>
        </div>
        {/* COD */}
        <div>
            <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="cod" className='ml-2'>Cash on Delivery (COD)</label>
        </div>
        <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
          Continue
        </button>
      </form>
    </div>
  )
}

export default page
