"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import api from "@/app/utils/axios"
import { Product } from "@/app/types"
import { useAppDispatch } from "@/app/redux/hook"
import { addToCart } from "@/app/redux/slice/cartSlice"
import { toast } from "react-toastify"

const SingleProductPage = () => {
    const {id} = useParams();
    const router = useRouter();

    const dispatch = useAppDispatch();

    const [product, setProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState(1);

    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        const fetchProduct = async()=>{
            try{
                const {data} = await api.get(`products/${id}`);
                setProduct(data.data);
            }catch(e){
                console.log(e);
            }finally{
                setLoading(false);
            }
        }
        fetchProduct();
    }, []);

    const addToCartHandler = () => {
       if(product){
        dispatch(addToCart({...product, qty}));
        toast.success('Product added to cart');
        router.push('/cart');
       }
    }

    if(loading) return <div>Loading...</div>
    if(!product) return <div>Product not found</div>

  return (
    <>

    <div className="bg-gray-100 dark:bg-gray-800 py-8">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
                <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                    {/* <Image className="w-full h-full object-cover" src={product.image} alt={product.name} /> */}
                </div>
                <div className="flex -mx-2 mb-4">
                    <div className="w-1/2 px-2">
                        <button onClick={addToCartHandler} className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700">Add to Cart</button>
                    </div>
                    <div className="w-1/2 px-2">
                        <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600">Add to Wishlist</button>
                    </div>
                </div>
            </div>
            <div className="md:flex-1 px-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Product Name</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                   {product.name}
                </p>
                <div className="flex mb-4">
                    <div className="mr-4">
                        <span className="font-bold text-gray-700 dark:text-gray-300">Price:</span>
                        <span className="text-gray-600 dark:text-gray-300">Rs. {product.price}</span>
                    </div>
                    <div>
                        <span className="font-bold text-gray-700 dark:text-gray-300">Availability:</span>
                        <span className="text-gray-600 dark:text-gray-300">{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                </div>
                <div>
                    <span className="font-bold text-gray-700 dark:text-gray-300">Product Description:</span>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

      
    </>
  )
}

export default SingleProductPage
