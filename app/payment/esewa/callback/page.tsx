"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/app/utils/axios";

export default function EsewaCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    let data = params.get("data");
    let orderId = params.get("orderId");

    // Some gateways append data with "?" even when success_url already has "?orderId="
    if (!data && orderId && orderId.includes("?data=")) {
      const [cleanOrderId, dataPart] = orderId.split("?data=");
      orderId = cleanOrderId;
      data = dataPart;
    }

    if (orderId && orderId.includes("?")) {
      orderId = orderId.split("?")[0];
    }

    console.log("eSewa Callback Params:", { data, orderId });

    if (!data || !orderId) {
      setStatus("Missing payment data.");
      return;
    }

    const verify = async () => {
      try {
        const response = await api.post("payment/esewa/callback", {
          data,
          orderId,
          returnJson: true,
        });
        const verifiedOrderId = response?.data?.orderId || orderId;
        router.replace(`/payment/success?orderId=${verifiedOrderId}`);
      } catch (e: any) {
        toast.error(e.response?.data?.message || "eSewa verification failed");
        router.replace("/payment/failed");
      }
    };

    verify();
  }, [params, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full border rounded-lg p-6 shadow-sm text-center">
        <div className="text-2xl font-semibold mb-2">Verifying Payment</div>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
}
