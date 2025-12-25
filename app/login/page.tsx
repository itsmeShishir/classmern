"use client"

import {useState, useEffect} from 'react';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { setCrediantials } from '../redux/slice/authSlice';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { MdOutlineEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();

    //redirect if logged in
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    const {userInfo} = useAppSelector((state) => state.auth);



    // useeffect -> admin and user
    useEffect(()=>{
        if(userInfo){
          if(redirect && redirect !== "/") {
            router.push(redirect);
          }else if(userInfo.role === "admin"){
              router.push("/admin/dashboard");
          }else{
              router.push("/");
          }
        }
    },[userInfo, router, redirect ]);

    const submitHandeler =  async( e: React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        try{
        const {data} = await api.post("users/login", {email, password});

        // dispatch to redux
        dispatch(setCrediantials(data));

        // set cookie
        Cookies.set("userInfo", JSON.stringify(data), {expires: 30});

        toast.success("login successfully")

        // redirect base on Role
        if (data.role === "admin" && redirect === "/") {
            router.push("/admin/dashboard");
        } else {
            router.push(redirect);
        }

        }catch(err : any){
            toast.error(err.response.data.message);
        }
        finally{
            setLoading(false);
        }}
    

  return (
    <>
    <div className="bg-gray-200 h-[50vh] flex items-center justify-center p-4 dark:bg-slate-800">
  <div className="bg-white p-6 shadow-lg rounded-xl w-96 dark:bg-slate-100">
    <form onSubmit={submitHandeler}>
      <div className="text-2xl text-blue-800 font-bold capitalize text-center mb-4">
        <h3>welcome back!</h3>
      </div>
      <div>
        <div>
          <div className="capitalize text-xl mb-2">
            <label>Email</label>
          </div>
          <div className="border-2 relative">
            <span className="absolute px-2 inset-y-0 left-0 flex items-center text-gray-400">
              <MdOutlineEmail />
            </span>
            <input 
            className="w-full placeholder:capitalize px-8 py-1.5 outline-blue-800" 
            type="text" 
            placeholder="enter Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="capitalize text-xl mb-2">
            <label>password</label>
          </div>
          <div className="border-2 relative">
            <span className="absolute px-2 inset-y-0 left-0 flex items-center text-gray-400">
              <IoIosLock />
            </span>
            <input className="w-full placeholder:capitalize px-8 py-1.5 outline-blue-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password" placeholder="enter password" />
          </div>
        </div>
        <div className="sm:flex sm:justify-between inline-block my-4">
          <div className="flex">
            <input className="text-blue-800" type="checkbox" />
            <span className="pl-1">Remember me</span>
          </div>
          <div className="text-blue-800 hover:underline">
          </div>
        </div>
        <div>
          <button
          type='submit'
          disabled={isLoading}
          className="bg-blue-800 text-xl text-white font-medium uppercase p-2 rounded-lg w-full opacity-90 hover:opacity-100">
            { isLoading ? "Signing In ... " : "Sing-in"}
          </button>
        </div>
        <div className="text-[18px] text-center mt-4">
          <p>Don't have an account? <Link className="capitalize text-blue-800 hover:underline cursor-pointer" href="/register">register</Link></p>
        </div>
      </div>
    </form>
  </div>
</div>
      
    </>
  )
}

export default LoginPage
