// get, post, get single product, update, delete
import Product from "../models/productModel.js";
import slugify from "slugify";
import path from "path";

const withImageUrl = (req, product) => {
    if (product?.image) {
        const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
        product.image = baseUrl + path.basename(product.image);
    }
};

const normalizeProductFields = (product) => {
    if (!product) return;
    product.countInStock = product.countInStock ?? product.countonstock ?? 0;
    product.numReviews = product.numReviews ?? product.numRating ?? 0;
};

export const getProducts = async(req, res) =>{
    try{
        const product = await Product.find();
        product.forEach((item) => {
            withImageUrl(req, item);
            normalizeProductFields(item);
        });
        res.status(200).json({
            message:"Product List",
            data: product
        })
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}

export const searchProduct = async(req, res) => {
    try{
        const {search} = req.query;
        const product = await Product.find({
            name: {$regex: search, $options: "i"} // i = case-insensative
        })
        product.forEach((item) => {
            withImageUrl(req, item);
            normalizeProductFields(item);
        });

        res.json({
            message: "Product found",
            success: true,
            count: product.count,
            product
        })

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}

export const advancesearchProduct = async(req, res) => {
    try{
        const {search, category, minPrice, maxPrice, stock, rating, sort } = req.query;
        
        // data types -> set 
        let filter = {}

        //serach
        if(search){
            filter.name = { $regex: search, $options:"i"}
        }
        // category
        if(category){
            filter.category = category;
        }
        // price max and min
        if (minPrice || maxPrice){
            filter.price = {};
            if(minPrice) filter.price.$gte= Number(minPrice)
            if(maxPrice) filter.price.$lte= Number(maxPrice)
        }
        // stock
        if(stock){
            filter.stock = {$gte: Number(stock)}
        }
        // rating
        if (rating){
            filter.rating = {};
            if(rating) filter.price.$gte= Number(rating)
        }

        // find the query
        let query = Product.find(filter);

        if(sort){ 
            query.sort(sort); // price, -price
        }

        const product = await query;
        product.forEach((item) => {
            withImageUrl(req, item);
            normalizeProductFields(item);
        });

        res.status(200).json({
            message: "product found",
            count: product.length,
            success: true,
            product
        })
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}



export const createProducts = async(req, res) =>{
    try{
        if(!req.file) return res.status(400).json({message: "Image required"});

        const product = await Product.create({
            ...req.body,
            user : req.user._id,
            image: `/uploads/${req.file.filename}`
        });
        res.status(201).json(
                    {
                        message: "product Created successfully",
                        data: product
                    }
        )

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}


export const getsingleProducts = async(req, res) =>{
    try{
        const product = await Product.findById(req.params.id);
        withImageUrl(req, product);
        normalizeProductFields(product);
        res.status(200).json({
            message:"Product List",
            data: product
        })
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}

export const updateProducts = async(req, res) =>{
    try{

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}

export const destroyProducts = async(req, res) =>{
    try{

    }catch(e){
        console.log(e.message);
        res.status(500).json({message: `${e.message}`})
    }
}
