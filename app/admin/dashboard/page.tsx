"use client";
import { useState, useEffect } from "react";
import api from "@/app/utils/axios";
import Link from "next/link";

interface DashboardData {
  userCount: number;
  productCount: number;
  orderCount: number;
  categoryCount: number;
}

const MainDashboard = (

) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('users/admin/dashboard');
        console.log(response.data);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="flex gap-4">
        <div className="w-[200px] h-[100px] bg-red-500 px-10 flex items-center justify-center"> total User : {data?.userCount}</div>
        <div  className="w-[200px] h-[100px] bg-red-500 px-10 flex items-center justify-center"> total Product : {data?.productCount}</div>
        <div  className="w-[200px] h-[100px] bg-red-500 px-10 flex items-center justify-center"> total Order : {data?.orderCount}</div>
        <div  className="w-[200px] h-[100px] bg-red-500 px-10 flex items-center justify-center">
          toaal category: {data?.categoryCount}
        </div>
      </div>
    </div>
  )
}

export default MainDashboard
