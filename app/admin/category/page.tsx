"use client"
import { useState, useEffect } from "react"
import api from "@/app/utils/axios"
import { toast } from "react-toastify"
import Link from "next/link"

interface Category {
    _id: string;
    name: string;
    image?: string;
}

// Ensure we always render an absolute URL even if the DB has a relative path
const toImageSrc = (src = "") =>
  src.startsWith("http") ? src : `http://localhost:5000${src}`;

const CategoryPage = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Array<Category>>([]);
    useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('category');
        setCategories(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      await api.delete(`category/${id}`);
      setCategories(categories.filter(category => category._id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }
    if (categories.length === 0) {
    return <div>No categories found</div>;
  }
  return (
    <div className=" mx-5">
        <div className="flex justify-between">
            <h1 className="text-3xl text-bold text-red-500">Categories</h1>
            <Link href="/admin/category/create" className="text-blue-500 hover:underline">Add Category</Link>
        </div>
       {/* table view */}
         <table className="min-w-full bg-white mt-4">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Image</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((category) => (
                    <tr key={category._id}>
                        <td className="py-2 px-4 border-b">{category.name}</td>
                        <td className="py-2 px-4 border-b">
                            {category.image ? (
                                <img
                                  src={toImageSrc(category.image)}
                                  alt={category.name}
                                  className="h-12 w-12 object-cover"
                                  width={100}
                                  height={100}
                                />
                            ) : (
                                "No Image"
                            )}
                        </td>
                        <td className="py-2 px-4 border-b">
                            <Link href={`/admin/category/${category._id}`} className="text-blue-500 hover:underline mr-4">Edit</Link>
                            <button onClick={() => handleDelete(category._id)} className="text-red-500 hover:underline">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>    
    </div>
  )
}

export default CategoryPage
