"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { logout } from "../redux/slice/authSlice";
import { FaBars } from "react-icons/fa";
import { useState } from "react";

function HeaderComponent() {
  const { userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  const username = userInfo?.email;
  const logoutHandler = () => {
    dispatch(logout());
    setMobileOpen(false);
  };
  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-[#0f172a] via-[#122033] to-[#0b2a2a] text-white">
      <nav className="border-b border-white/10 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 py-3 mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <img
                src="https://www.svgrepo.com/show/499962/music.svg"
                className="h-5 w-5"
                alt="Eshop Nepal Logo"
              />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-wide">Eshop Nepal</div>
              <div className="text-xs text-white/60">Shop smarter, live better</div>
            </div>
          </Link>

          <div className="flex items-center gap-2 lg:order-2">
            {userInfo ? (
              <>
                <Link
                  href="/profile"
                  className="hidden sm:inline-flex items-center rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
                >
                  {username}
                </Link>
                <button
                  onClick={logoutHandler}
                  className="rounded-full bg-amber-400/90 text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-amber-400 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobile}
                  className="rounded-full bg-amber-400/90 text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-amber-400 transition"
                >
                  Register
                </Link>
              </div>
            )}
            <button
              onClick={toggleMobile}
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm rounded-lg lg:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-controls="mobile-menu-2"
              aria-expanded={mobileOpen}
            >
              <span className="sr-only">Open main menu</span>
              <FaBars aria-hidden="true" />
            </button>
          </div>

          <div
            className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${
              mobileOpen ? "block" : "hidden"
            }`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  href="/"
                  onClick={closeMobile}
                  className="block py-2 pl-3 pr-4 rounded lg:bg-transparent lg:p-0 text-white/90 hover:text-white"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/category"
                  onClick={closeMobile}
                  className="block py-2 pl-3 pr-4 text-white/70 hover:text-white lg:p-0"
                >
                  Category
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  onClick={closeMobile}
                  className="block py-2 pl-3 pr-4 text-white/70 hover:text-white lg:p-0"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  onClick={closeMobile}
                  className="block py-2 pl-3 pr-4 text-white/70 hover:text-white lg:p-0"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="block py-2 pl-3 pr-4 text-white/70 hover:text-white lg:p-0"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeaderComponent;
