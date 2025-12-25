"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/app/utils/axios"
import { toast } from "react-toastify"
import Link from "next/link"


const EditCategory = () => {
    const {id} = useParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchCategory = async()=>{
            try{
                const {data} = await api.get(`category/${id}`);
                setName(data.data.name);
            }catch(e){
                toast.error("Failed to fetch category");
            }finally{
                setLoading(false);
            }
        }
        fetchCategory();
    }, [id]);

    const submitHandler = async(e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        if(image){
            formData.append("image", image);
        }
        try{
            await api.patch(`category/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Category updated successfully");
            router.push("/admin/category");
        }catch(e){
            toast.error("Failed to update category");
        }
    }
  return (
    <div>
        {loading ? (<div>Loading...</div>
        ) : (
            <div className="max-w-md mx-auto mt-10">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold mb-5">Edit Category</h1>
                    <Link href="/admin/category" className="text-blue-500 hover:underline">Back</Link>
                </div>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Image</label>
                        <input 
                            type="file" 
                            onChange={(e) => {
                                if(e.target.files && e.target.files.length > 0){
                                    setImage(e.target.files[0]);
                                }
                            }} 
                            className="w-full"
                        />
                    </div>
                    <div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Update Category</button>
                    </div>
                </form>
            </div>
        )}
      
    </div>
  )
}

export default EditCategory
