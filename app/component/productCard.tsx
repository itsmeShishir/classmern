import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../types';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({
    product
}: {
    product: Product
}) => {
  return (
    <div className='bg-white rouded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300'>
        <Link href={`/products/${product._id}`}>
            <div className='relative h-64 w-full bg-gray-100'>
                <Image src={product.image} alt={product.name} fill className='object-contain p-4' />

            </div>
            <div className='p-4'>
                <Link href={`/products/${product._id}`}>
                    <h2 className='text-lg font-bold text-gray-800 truncate hover:text-yellow-600'>
                        {product.name}
                    </h2>
                </Link>
                <div className='flex items-center mt-2'>
                    <span className='text-yellow-400 flex mr-1'>
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i}  className={i < product.rating ? 'text-yellow-400' : 'text-gray-300'}/>
                        ))}
                        <span className='text-gray-500 ml-1'>
                            {product.numReviews}
                        </span>
                    </span>
                </div>
                <div className='mt-3 flex jutify-between items-center'>
                    <span className='text-xl font-bold text-gray-900 '>
                        Rs {product.price}
                    </span>

                </div>
            </div>
        </Link>
    </div>
  )
}

export default ProductCard
