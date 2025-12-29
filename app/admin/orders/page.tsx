"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/app/utils/axios";

interface AdminOrder {
  _id: string;
  user?: { name?: string };
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt?: string;
}

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("orders");
        setOrders(data || []);
      } catch (e: any) {
        toast.error(e.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-500">Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="mt-4">No orders found.</div>
      ) : (
        <table className="min-w-full bg-white mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Paid</th>
              <th className="py-2 px-4 border-b">Delivered</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border-b">{order._id}</td>
                <td className="py-2 px-4 border-b">{order.user?.name || "-"}</td>
                <td className="py-2 px-4 border-b">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="py-2 px-4 border-b">${order.totalPrice?.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">
                  {order.isPaid
                    ? new Date(order.paidAt || "").toLocaleDateString()
                    : "No"}
                </td>
                <td className="py-2 px-4 border-b">
                  {order.isDelivered
                    ? new Date(order.deliveredAt || "").toLocaleDateString()
                    : "No"}
                </td>
                <td className="py-2 px-4 border-b">
                  <Link
                    href={`/admin/orders/${order._id}`}
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
