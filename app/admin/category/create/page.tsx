"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import api from "@/app/utils/axios"
import { toast } from "react-toastify"
import Link from "next/link"
import Image from "next/image"


const CreateCategory = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>("");
    const [loading, setLoading] = useState(true);

    // const handle file onChange
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }

    }

    const submitHandler = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !image){
            toast.error("Please provide all required fields");
            return;
        }
        try{
            const formData = new FormData();
            formData.append("name", name);
            formData.append("image", image);
            await api.post(`category`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Category created successfully");
            router.push("/admin/category");
        }catch(e){
            toast.error("Failed to create category");
        }
    }
   
  return (
    <div>
            <div className="max-w-md mx-auto mt-10">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold mb-5">Create Category</h1>
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
                            onChange={handleFileChange} 
                            className="w-full"
                        />
                        {preview && (
                            <div className="mt-4">
                                <Image src={preview} alt="Preview" width={100} height={100} className="object-cover"/>
                            </div>
                        )}
                    </div>
                    <div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Create Category</button>
                    </div>
                </form>
            </div>
      
    </div>
  )
}

export default CreateCategory
