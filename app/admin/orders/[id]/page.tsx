"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/app/utils/axios";

interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

interface OrderDetail {
  _id: string;
  user?: { name?: string; email?: string };
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber?: string;
    phone_number?: string;
  };
  paymentMethod: string;
  itemPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt?: string;
}

const toImageSrc = (src = "") =>
  src.startsWith("http") ? src : `http://localhost:5000${src}`;

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get<OrderDetail>(`orders/${id}`);
      setOrder(data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const markPaid = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      await api.put(`orders/${order._id}/pay`, {
        id: "admin",
        status: "PAID",
        update_time: new Date().toISOString(),
        payer: {
          email_address: order.user?.email || "admin@local",
        },
      });
      toast.success("Order marked as paid");
      fetchOrder();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update payment");
    } finally {
      setUpdating(false);
    }
  };

  const markDelivered = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      await api.put(`orders/${order._id}/deliver`);
      toast.success("Order marked as delivered");
      fetchOrder();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update delivery");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Loading order...</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  const phone =
    order.shippingAddress?.phoneNumber || order.shippingAddress?.phone_number || "";

  return (
    <div className="container mx-auto my-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order {order._id}</h1>
        <Link href="/admin/orders" className="text-blue-500 hover:underline">
          Back to Orders
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <section className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Customer</h2>
            <p className="text-sm text-gray-700">{order.user?.name || "-"}</p>
            <p className="text-sm text-gray-700">{order.user?.email || "-"}</p>
            <p className="text-sm text-gray-700">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
            </p>
          </section>

          <section className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Shipping</h2>
            <p className="text-sm text-gray-700">
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {phone && <p className="text-sm text-gray-700">Phone: {phone}</p>}
            <div
              className={`mt-2 text-sm font-semibold ${
                order.isDelivered ? "text-green-600" : "text-red-500"
              }`}
            >
              {order.isDelivered
                ? `Delivered at ${new Date(order.deliveredAt || "").toLocaleString()}`
                : "Not Delivered"}
            </div>
          </section>

          <section className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Payment</h2>
            <p className="text-sm text-gray-700 capitalize">
              Method: {order.paymentMethod}
            </p>
            <div
              className={`mt-2 text-sm font-semibold ${
                order.isPaid ? "text-green-600" : "text-red-500"
              }`}
            >
              {order.isPaid
                ? `Paid at ${new Date(order.paidAt || "").toLocaleString()}`
                : "Not Paid"}
            </div>
            {!order.isPaid && (
              <button
                onClick={markPaid}
                disabled={updating}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Mark as Paid
              </button>
            )}
          </section>

          <section className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-3">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p>Your order is empty</p>
            ) : (
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={toImageSrc(item.image)}
                        alt={item.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <Link
                        href={`/products/${item.product}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-sm font-medium">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="border rounded p-4 h-fit space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>${order.itemPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${order.shippingPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${order.taxPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>

          {!order.isDelivered && (
            <button
              onClick={markDelivered}
              disabled={updating}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              Mark as Delivered
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
