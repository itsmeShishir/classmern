"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/app/utils/axios";
import { Product } from "@/app/types";

const toImageSrc = (src = "") =>
  src.startsWith("http") ? src : `http://localhost:5000${src}`;

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("products");
        const list = Array.isArray(data.data) ? data.data : data?.data?.products || [];
        setProducts(list);
      } catch (e: any) {
        toast.error(e.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-500">Products</h1>
      </div>

      {products.length === 0 ? (
        <div className="mt-4">No products found.</div>
      ) : (
        <table className="min-w-full bg-white mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Stock</th>
              <th className="py-2 px-4 border-b">Rating</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="py-2 px-4 border-b">
                  <img
                    src={toImageSrc(product.image)}
                    alt={product.name}
                    className="h-12 w-12 object-cover"
                    width={48}
                    height={48}
                  />
                </td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">Rs {product.price}</td>
                <td className="py-2 px-4 border-b">{product.countInStock}</td>
                <td className="py-2 px-4 border-b">{product.rating}</td>
                <td className="py-2 px-4 border-b">
                  <Link
                    href={`/products/${product._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
