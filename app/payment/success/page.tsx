"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full border rounded-lg p-6 shadow-sm text-center">
        <div className="text-3xl mb-4 text-green-600 font-bold">Payment Successful</div>
        <p className="text-gray-700 mb-6">
          Thank you! Your payment was confirmed. You can review your order details below.
        </p>
        {orderId ? (
          <Link
            href={`/order/${orderId}`}
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            View Order
          </Link>
        ) : (
          <Link
            href="/profile"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Go to Profile
          </Link>
        )}
      </div>
    </div>
  );
}
