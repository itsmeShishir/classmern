"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaList } from "react-icons/fa"

const AdminSidebar = () => {
    const pathname = usePathname();
    const navitems = [
        {name: "Dashboard", path: "/admin/dashboard", icon:<FaBoxOpen />},
        {name: "Products", path: "/admin/products" , icon:<FaShoppingCart />},
        {name: "Orders", path: "/admin/orders" , icon:<FaTachometerAlt />},
        {name: "Users", path: "/admin/users" , icon:<FaUsers />},
        {name: "Categories", path: "/admin/category" , icon:<FaList />},
    ]
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen pt-4 hidden md:block">
        <div className="mb-8 text-2xl font-bold text-center text-yellow-500 border-b border-gray-700 pb-4">
            <h1>Admin panel</h1>
            {
                navitems.map((item) => (
                    <Link 
                        key={item.name}
                        href={item.path} 
                        className={`flex items-center px-6 py-3 mt-2 hover:bg-gray-700 
                        ${pathname === item.path ? 'bg-gray-700' : ''}`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </Link>
                ))
            }
        </div>
      
    </aside>
  )
}

export default AdminSidebar