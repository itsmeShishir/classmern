"use client"
import {useState, useEffect} from "react";
import api from "./utils/axios";
import { Product } from "./types";
import { toast } from "react-toastify";
import ProductCard from "./component/productCard";
import Link from "next/link";


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try{
        const {data}  = await api.get(`products`);
        if(Array.isArray(data.data)){
          const fullData = data.data
          setProducts(fullData);

        }else{
          setProducts(data.data.products)
          console.log(data.data);

        }

      }catch(e: any){
        toast.error(e.message);
      }finally{
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if(loading) return <div className="text-center py-20">LOading ...</div>

  return (
    <>
<section className="w-full flex items-center justify-center h-[50vh] overflow-hidden bg-gradient-to-b from-[#10111D] to-green-300">

  <div className="relative z-10 container mx-auto px-4 text-center text-white">
    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{lineHeight: "1.2"}}>
      We Make <span className="relative whitespace-nowrap text-green-300 dark:text-green-400">
        <span className="relative ">Buying Experience better</span>
      </span> 
    </h1>
    <p className="mx-auto mb-8 max-w-2xl text-lg">
      Professional photography services for weddings, events, portraits, and commercial shoots. Let us tell your story through our lens.
    </p>

    <div className="flex justify-center items-center mt-8" data-aos="fade-up" data-aos-delay="400">
      <Link href="#pricing" rel="noopener noreferrer"
        className="relative flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200">
        <span className="absolute inset-0 rounded-full bg-green-600 opacity-50 animate-pulse"></span>
        <span className="relative z-10 pr-2">Login Now</span>
      </Link>
    </div>
  </div>

  <div className="absolute sm:bottom-14 bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
    <Link href="#about" className="cursor-pointer">
    </Link>
  </div>
</section>
    {/* Category */}
      <div>
        <h1>
          <section className=" w-full bg-white dark:bg-[#0A2025] py-9 px-8">
            <div className="mx-auto max-w-[1160px] ">
              <header className="h-12 mb-8 justify-between items-center flex">
                <h2 className="text-[#0A2025] dark:text-white text-2xl font-bold font-['Roboto']">Shop by Sport</h2>
                <div className="flex gap-4"></div>
              </header>
              <main className="flex items-center flex-col md:flex-row  gap-10">
                <div><img className="mb-7 rounded-xl" src="https://iili.io/33etOiX.png" />
                  <div>
                    <h3 className="text-[#0A2025] dark:text-white text-2xl font-bold font-['Roboto']">Keni Golf</h3>
                    <p className="mt-5 mb-8 text-[#0A2025] dark:text-white text-sm font-normal font-['Roboto']">Everything you need
                      for any course</p><button className="text-[#3e9d26] text-sm font-semibold font-['Roboto']">Shop</button>
                  </div>
                </div>
                <div><img className="mb-7 rounded-xl" src="https://iili.io/33etkfn.png" />
                  <div>
                    <h3 className="text-[#0A2025] dark:text-white text-2xl font-bold font-['Roboto']">Keni basketball</h3>
                    <p className="mt-5 mb-8 text-[#0A2025] dark:text-white text-sm font-normal font-['Roboto']">Styles made for your
                      games.</p><button className="text-[#3e9d26] text-sm font-semibold font-['Roboto']">Shop</button>
                  </div>
                </div>
                <div><img className="mb-7 rounded-xl" src="https://iili.io/33etvls.png" />
                  <div>
                    <h3 className="text-[#0A2025] dark:text-white text-2xl font-bold font-['Roboto']">Keni Trail Running</h3>
                    <p className="mt-5 mb-8 text-[#0A2025] dark:text-white text-sm font-normal font-['Roboto']">Everything you need
                      for adventure.</p><button className="text-[#3e9d26] text-sm font-semibold font-['Roboto']">Shop</button>
                  </div>
                </div>
              </main>
            </div>
          </section>
        </h1>
      </div>
      {/* Product  */}

      <div className="">
        <h1 className="text-3xl font-bold mb-6 text-gray-500">Latest Product</h1>  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {
            products.map((product) => (<ProductCard  key={product._id} product={product}/>) )
          }
        </div>
      </div>      
    
    </>
   
  );
}
