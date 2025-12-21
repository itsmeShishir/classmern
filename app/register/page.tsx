"use client"

import {useState, useEffect} from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { setCrediantials } from '../redux/slice/authSlice';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { MdOutlineEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setLoading] = useState(false);

    const router = useRouter();

    const {userInfo} = useAppSelector((state) => state.auth);

    // useeffect -> admin and user
    useEffect(()=>{
      if(userInfo) router.push("/");
    },[userInfo, router ]);

    const submitHandeler =  async( e: React.FormEvent)=>{
        e.preventDefault();
        if(password !== confirmPassword){
          toast.error("password not match");
          return;
        }

        setLoading(true);

        try{
        const {data} = await api.post("users/register", {name, email, password});

        toast.success("register successfully")
        router.push("/login");

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
        <h3>Register Here</h3>
      </div>
      <div>
         <div>
          <div className="capitalize text-xl mb-2">
            <label>Username</label>
          </div>
          <div className="border-2 relative">
            <span className="absolute px-2 inset-y-0 left-0 flex items-center text-gray-400">
              <MdOutlineEmail />
            </span>
            <input className="w-full placeholder:capitalize px-8 py-1.5 outline-blue-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text" placeholder="enter Email" />
          </div>
        </div>
        <div>
          <div className="capitalize text-xl mb-2">
            <label>Email</label>
          </div>
          <div className="border-2 relative">
            <span className="absolute px-2 inset-y-0 left-0 flex items-center text-gray-400">
              <MdOutlineEmail />
            </span>
            <input className="w-full placeholder:capitalize px-8 py-1.5 outline-blue-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text" placeholder="enter Email" />
          </div>
        </div>
        <div className="mt-4">
          <div className="capitalize text-xl mb-2">
            <label>Password</label>
          </div>
          <div className="border-2 relative">
            <span className="absolute px-2 inset-y-0 left-0 flex items-center text-gray-400">
              <IoIosLock />
            </span>
            <input className="w-full placeholder:capitalize px-8 py-1.5 outline-blue-800" value={password}
            onChange={(e) => setPassword(e.target.value)} type="password" placeholder="enter Password" />
          </div>
        </div>
         <div className="mt-4">
          <div className="capitalize text-xl mb-2">
            <label>Confirm Password</label>
          </div>
          <div className="border-2 relative">
            <span className="absolute px-2 inset-y-0 left-0 flex items-center text-gray-400">
              <IoIosLock />
            </span>
            <input className="w-full placeholder:capitalize px-8 py-1.5 outline-blue-800"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
             type="password" placeholder="enter Confirmed Password" />
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
          <button className="bg-blue-800 text-xl text-white font-medium uppercase p-2 rounded-lg w-full opacity-90 hover:opacity-100">
             { isLoading ? "User Registering ... " : "Register"}
          </button>
        </div>
        <div className="text-[18px] text-center mt-4">
          <p>Already have an account? <Link className="capitalize text-blue-800 hover:underline cursor-pointer" href="/login">Login</Link></p>
        </div>
      </div>
    </form>
  </div>
</div>
      
    </>
  )
}

export default RegisterPage
