"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/app/utils/axios";

interface AdminUserDetail {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get<{ data: AdminUserDetail }>(`users/${id}`);
        const user = data.data || data;
        setName(user.name || "");
        setEmail(user.email || "");
        setRole(user.role || "user");
      } catch (e: any) {
        toast.error(e.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`users/${id}`, { name, email, role });
      toast.success("User updated");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await api.put(`users/${id}/password`, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success("Password updated");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await api.delete(`users/${id}`);
      toast.success("User deleted");
      router.push("/admin/users");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-5 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-red-500">Edit User</h1>
        <Link href="/admin/users" className="text-blue-500 hover:underline">
          Back
        </Link>
      </div>

      <section className="bg-white border rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <form onSubmit={submitProfile} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              className="w-full border rounded p-2"
              value={role}
              onChange={(e) => setRole(e.target.value as "user" | "admin")}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:underline"
            >
              Delete User
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white border rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
        <form onSubmit={submitPassword} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              className="w-full border rounded p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border rounded p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}
