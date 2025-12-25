import Category from "../models/categoryModel.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";

export const getAllCategory = async(req, res)=>{
    try{
        const categories = await Category.find();
        // make this into a function so we can just call and provide the parameters

        const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
        categories.forEach(category => {
            if(category.image){
                category.image = baseUrl + path.basename(category.image);
            }
        });
        res.status(200).json({
            data: categories
        })

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}

export const createCategory = async(req, res) =>{
    try{
        const { name } = req.body;
        if(!req.file){
            return res.status(400).json({message:"Category image is required"})
        }
        const imagePath =`/uploads/${req.file.filename}`;

        const category = await Category.create({
            name, 
            slug: slugify(name),
            image: imagePath
        })
        res.status(201).json({
            message:"Category Created succesfully", 
            data: category
        })
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}

export const getSingleCategory = async(req, res) =>{
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message: "category not found"})
        }
        res.status(200).json({
            message: "Category found",
            data: category
        })

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}

export const updateCategory = async(req, res) =>{
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message: "category not found"})
        }
        //update name and slug
        if(req.body.name){
            category.name = req.body.name;
            category.slug = slugify(req.body.name);
        };

        // update the image (delete old image and new image )
        if(req.file){
            const oldPath = path.join(process.cwd(),"public", category.image);

            if (fs.existsSync(oldPath)){
                fs.unlinkSync(oldPath) //delete
            }

            //
            category.image = `/uploads/${req.file.filename}`;
        }

        const updateCategory = await category.save();
        res.status(204).json({message: "category updated successfully"})


    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}

export const destroyCategory = async(req, res) =>{
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message: "category not found"})
        }

        const oldPath = path.join(process.cwd(),"public", category.image);

        if (fs.existsSync(oldPath)){
                fs.unlinkSync(oldPath) //delete
        }

        const deletecat = await category.deleteOne();
        res.status(205).json({
            message: "category delete successfully", data: deletecat}
        );

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}