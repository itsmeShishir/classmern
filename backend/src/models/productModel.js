import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
        required: true,
        unique: true,
    },
    category:{
        type: mongoose.Schema.ObjectId, 
        ref:"Category", 
        required: true
    },
    createdBy:{
        type: mongoose.Schema.ObjectId, 
        ref:"User", 
        required: true
    },
    slug:{
        type: String,
        lowercase: true,
        index: true
    },
    image:{
        type: String,
        required: false
    },
    brand:{
        type: String,
        required: false
    },
    countonstock:{
        type:Number,
        default: 0,
        required: true
    },
    price:{
        type:Number,
        default: 0,
        required: true
    },
    rating:{
        type: Number, 
        default: 0
    },
    numRating:{
        type: Number, 
        default: 0
    }
},{timestamps: true});

const Product = mongoose.model("product", productSchema);

export default Product;