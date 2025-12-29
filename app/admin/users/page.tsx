"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/app/utils/axios";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("users");
        setUsers(data.data || data);
      } catch (e: any) {
        toast.error(e.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await api.delete(`users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-500">Users</h1>
      </div>

      <table className="min-w-full bg-white mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b capitalize">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <Link
                  href={`/admin/users/${user._id}`}
                  className="text-blue-500 hover:underline mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
