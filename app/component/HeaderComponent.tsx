"use client"

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { logout } from "../redux/slice/authSlice"
import { FaBars } from "react-icons/fa";
import { useState } from "react";

function HeaderComponent() {
    const {userInfo} = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [mobileOpen, setMobileOpen] = useState(false);

    const username = userInfo?.email;
    const logoutHandler = () => {
        dispatch(logout());
        setMobileOpen(false);
    }
    const toggleMobile = () => setMobileOpen((prev) => !prev);
    const closeMobile = () => setMobileOpen(false);
  return (
    <div>
      <nav className="bg-white border-gray-200 py-2.5 dark:bg-gray-900">
    <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
        <Link href="/" className="flex items-center">
            <img src="https://www.svgrepo.com/show/499962/music.svg" className="h-6 mr-3 sm:h-9" alt="Landwind Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Landwind</span>
        </Link>
        <div className="flex items-center lg:order-2">
            <div className="hidden mt-2 mr-4 sm:inline-block">
                <span></span>
            </div>

            {
                userInfo ? (
                    <>
                        <Link href="/"
                            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 
                            focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 
                            lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 
                            focus:outline-none dark:focus:ring-purple-800">Profile {username} </Link>
                            <button onClick={logoutHandler}
                            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 
                            focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 
                            lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 
                            focus:outline-none dark:focus:ring-purple-800">
                                Logout
                            </button>
                    </>

                ): 
                <div>
                    <Link href="/login" onClick={closeMobile}
                className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 
                focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 
                lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 
                focus:outline-none dark:focus:ring-purple-800">login</Link>
                <Link href="/register" onClick={closeMobile}
                className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 
                focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 
                lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 
                focus:outline-none dark:focus:ring-purple-800">register</Link>
                </div>
            }
            <button onClick={toggleMobile} type="button"
				className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				aria-controls="mobile-menu-2" aria-expanded={mobileOpen}>
				<span className="sr-only">Open main menu</span>
				<FaBars aria-hidden="true" />
			</button>
        </div>
        <div
            className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${mobileOpen ? "block" : "hidden"}`}
            id="mobile-menu-2"
        >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                    <Link href="/" onClick={closeMobile}
                        className="block py-2 pl-3 pr-4 text-white bg-purple-700 rounded lg:bg-transparent lg:text-purple-700 lg:p-0 dark:text-white"
                        aria-current="page">Home</Link>
                </li>
                <li>
                    <Link href="/category" onClick={closeMobile}
                        className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Category</Link>
                </li>
                <li>
                    <Link href="/products" onClick={closeMobile}
                        className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Products</Link>
                </li>
                <li>
                    <Link href="/cart" onClick={closeMobile}
                        className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Cart</Link>
                </li>
                <li>
                    <Link href="/contact" onClick={closeMobile}
                        className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Contact</Link>
                </li>
            </ul>
        </div>
    </div>
</nav>
    </div>
  )
}

export default HeaderComponent
