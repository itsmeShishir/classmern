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
                <div className="flex gap-4"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 0.5C16.1433 0.5 12.3731 1.64366 9.16639 3.78634C5.95963 5.92903 3.46027 8.97451 1.98436 12.5377C0.508449 16.1008 0.122284 20.0216 0.874696 23.8043C1.62711 27.5869 3.4843 31.0615 6.21143 33.7886C8.93855 36.5157 12.4131 38.3729 16.1957 39.1253C19.9784 39.8777 23.8992 39.4916 27.4623 38.0156C31.0255 36.5397 34.071 34.0404 36.2137 30.8336C38.3564 27.6269 39.5 23.8567 39.5 20C39.4945 14.83 37.4383 9.87322 33.7826 6.21745C30.1268 2.56167 25.1701 0.50546 20 0.5ZM20 36.5C16.7366 36.5 13.5465 35.5323 10.8331 33.7192C8.11969 31.9062 6.00484 29.3293 4.756 26.3143C3.50715 23.2993 3.1804 19.9817 3.81705 16.781C4.45371 13.5803 6.02518 10.6403 8.33275 8.33274C10.6403 6.02517 13.5803 4.4537 16.781 3.81704C19.9817 3.18039 23.2993 3.50714 26.3143 4.75599C29.3293 6.00483 31.9062 8.11968 33.7193 10.8331C35.5323 13.5465 36.5 16.7366 36.5 20C36.495 24.3745 34.7551 28.5685 31.6618 31.6618C28.5685 34.7551 24.3746 36.495 20 36.5ZM29 20C29 20.3978 28.842 20.7794 28.5607 21.0607C28.2794 21.342 27.8978 21.5 27.5 21.5H16.1206L19.5613 24.9387C19.7006 25.0781 19.8112 25.2436 19.8866 25.4257C19.962 25.6077 20.0008 25.8029 20.0008 26C20.0008 26.1971 19.962 26.3923 19.8866 26.5743C19.8112 26.7564 19.7006 26.9219 19.5613 27.0613C19.4219 27.2006 19.2564 27.3112 19.0744 27.3866C18.8923 27.462 18.6971 27.5008 18.5 27.5008C18.3029 27.5008 18.1078 27.462 17.9257 27.3866C17.7436 27.3112 17.5781 27.2006 17.4388 27.0613L11.4388 21.0613C11.2993 20.9219 11.1887 20.7565 11.1132 20.5744C11.0377 20.3923 10.9988 20.1971 10.9988 20C10.9988 19.8029 11.0377 19.6077 11.1132 19.4256C11.1887 19.2435 11.2993 19.0781 11.4388 18.9387L17.4388 12.9387C17.7202 12.6573 18.102 12.4992 18.5 12.4992C18.8981 12.4992 19.2798 12.6573 19.5613 12.9387C19.8427 13.2202 20.0008 13.602 20.0008 14C20.0008 14.398 19.8427 14.7798 19.5613 15.0613L16.1206 18.5H27.5C27.8978 18.5 28.2794 18.658 28.5607 18.9393C28.842 19.2206 29 19.6022 29 20Z"
                      fill="#449596" fill-opacity="0.5"></path>
                  </svg><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 0.5C16.1433 0.5 12.3731 1.64366 9.16639 3.78634C5.95963 5.92903 3.46027 8.97451 1.98436 12.5377C0.508449 16.1008 0.122284 20.0216 0.874696 23.8043C1.62711 27.5869 3.4843 31.0615 6.21143 33.7886C8.93855 36.5157 12.4131 38.3729 16.1957 39.1253C19.9784 39.8777 23.8992 39.4916 27.4623 38.0156C31.0255 36.5397 34.071 34.0404 36.2137 30.8336C38.3564 27.6269 39.5 23.8567 39.5 20C39.4945 14.83 37.4383 9.87322 33.7826 6.21745C30.1268 2.56167 25.1701 0.50546 20 0.5ZM20 36.5C16.7366 36.5 13.5465 35.5323 10.8331 33.7192C8.11969 31.9062 6.00484 29.3293 4.756 26.3143C3.50715 23.2993 3.1804 19.9817 3.81705 16.781C4.45371 13.5803 6.02518 10.6403 8.33275 8.33274C10.6403 6.02517 13.5803 4.4537 16.781 3.81704C19.9817 3.18039 23.2993 3.50714 26.3143 4.75599C29.3293 6.00483 31.9062 8.11968 33.7193 10.8331C35.5323 13.5465 36.5 16.7366 36.5 20C36.495 24.3745 34.7551 28.5685 31.6618 31.6618C28.5685 34.7551 24.3746 36.495 20 36.5ZM28.5613 18.9387C28.7007 19.0781 28.8114 19.2435 28.8868 19.4256C28.9623 19.6077 29.0012 19.8029 29.0012 20C29.0012 20.1971 28.9623 20.3923 28.8868 20.5744C28.8114 20.7565 28.7007 20.9219 28.5613 21.0613L22.5613 27.0613C22.2798 27.3427 21.8981 27.5008 21.5 27.5008C21.102 27.5008 20.7202 27.3427 20.4388 27.0613C20.1573 26.7798 19.9992 26.398 19.9992 26C19.9992 25.602 20.1573 25.2202 20.4388 24.9387L23.8794 21.5H12.5C12.1022 21.5 11.7207 21.342 11.4393 21.0607C11.158 20.7794 11 20.3978 11 20C11 19.6022 11.158 19.2206 11.4393 18.9393C11.7207 18.658 12.1022 18.5 12.5 18.5H23.8794L20.4388 15.0613C20.1573 14.7798 19.9992 14.398 19.9992 14C19.9992 13.602 20.1573 13.2202 20.4388 12.9387C20.7202 12.6573 21.102 12.4992 21.5 12.4992C21.8981 12.4992 22.2798 12.6573 22.5613 12.9387L28.5613 18.9387Z"
                      fill="#3E9D26"></path>
                  </svg></div>
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
