"use client";

import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full border rounded-lg p-6 shadow-sm text-center">
        <div className="text-3xl mb-4 text-red-600 font-bold">Payment Failed</div>
        <p className="text-gray-700 mb-6">
          We could not verify your payment. You can try again or choose another method.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/payment"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Choose Payment Method
          </Link>
          <Link
            href="/cart"
            className="inline-block bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
