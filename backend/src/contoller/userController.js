import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js";

// Register a new users
export const registerUser = async(req, res) =>{
    try{
        const {name,email,password} = req.body;
        
        const userExists = await User.findOne({email})

        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }
        console.log("no user found now creating");
        
        const user = await User.create(
            {
                name,
                email,
                password,
            }
        );
        res.status(201).json({
            success:true,
            data:user,
            message:"User Created Successfully"
        });
    }catch(e){
        console.log(e.message, e.stack);
        res.status(500).json({message: e.message});
    }
}

// local login 
export const loginUser = async(req, res) =>{
    try{
        // req.body = email and password
        // check if email exists -> res 
        // check the user && await user.matchPassword(password) -> hamro data like id, name, email, token 
        // else -> res 401 . message
        const {email , password} = req.body;
        const user = await User.findOne({email});
        if (user && (await user.matchPassword(password))){
            res.status(200).json({
                message:"Login successful",
                _id:user._id,
                email:user.email,
                role:user.role,
                token: generateToken(user._id)
            })
        }else{
            res.status(401).json({message: "Invalid email or password"})
        }
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: e.message})
    }
} 

// Get all the user list function 
export const getAllUser = async(req, res)=>{
    try{
        const allUsers = await User.find();

        res.status(200).json({
            success:true,
            message:"All the user list",
            meta: { 
                total: allUsers.length 
            },
            data: allUsers,
        })

    }catch(e){
        console.log(e.message);
        res.status(500).json({message:e.message})
    }
}

// id
export const getSingleUser = async(req, res)=>{
    try{
        const user = await User.findById(req.user._id);
        if(user){
            res.json({
                _id: user._id,
                name : user.name, 
                email : user.email,
                role: user.role
            });
        }else{
            res.status(404).json({message: "User Not Found"});
        }
    }catch(e){
        console.log(e.message);
        res.status(500).json({message:e.message})
    }
}

// update user Profile 
export const updateUserProfile = async(req, res)=>{
    try{
        const user = await User.findById(req.user._id);
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            // update profile password change 
            const updateUser = await user.save();
            res.status(200).json({
                message:"Password Update Successfully",
                data: updateUser
            })

        }else{
            res.status(404).json({message: "User Not Found"});
        }
    }catch(e){
        console.log(e.message);
        res.status(500).json({message:e.message})
    }
}

export const ChangePassword = async(req, res) =>{
    try{
        // old password, new password, confirm password 
        const {old_Password, new_password, confirm_password} = req.body;
        if (new_password !== confirm_password){
            return res.status(400).josn({
                message: "New Password and confirmed password does not match"
            })
        }

        // user =_id
        const user = await User.findById(req.user._id);

        // if user not found 
        if (!user){
            return res.status(404).json({message: "User Not Found"});
        }

        // old_password -> check 
        if (await user.matchPassword(old_Password)){
            // old_password ==new password
            user.password = new_password;
            // save
            await user.save();

            res.json({
                message: "User password updated successfully"
            })
        }else{
            res.status(401).json({message: "Old Password doen not match"});
        }

    }catch(e){
        console.log(e.message);
        res.status(500).json({message:e.message})
    }
}

// get user by id 
export const getUserById = async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            res.json({
                data: user
            });
        }else{
            res.status(404).json({message: "User Not Found"});
        }
    }catch(e){
        console.log(e.message);
        res.status(500).json({message:e.message})
    }
}
// delete User
export const deleteUser = async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
           await user.deleteOne();
           res.status(205).json({
            message: "User Delete Successfully"
           })
        }else{
            res.status(404).json({message: "User Not Found"});
        }
    }catch(e){
        console.log(e.message);
        res.status(500).json({message:e.message})
    }
}

export const updateUser = async (req, res, next)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            // update profile password change 
            const updateUser = await user.save();
            res.status(200).json({
                message:"User Update Successfully",
                data: updateUser
            })
        }else{
            res.status(404).json({message: "User Not Found"});
        }
    }catch(e){
        console.log(e.message);
        res.status(500).json({message:e.message})
    }
}

export const changePasswordbyadmin = async(req, res) =>{
     try{
        const { new_password, confirm_password} = req.body;
        if (new_password !== confirm_password){
            return res.status(400).josn({
                message: "New Password and confirmed password does not match"
            })
        }

        // user =_id
        const user = await User.findById(req.params.id);

        // if user not found 
        if (!user){
            return res.status(404).json({message: "User Not Found"});
        }

        user.password = new_password;
        await user.save();

        res.json({
            message: "User password updated successfully"
        })

    }catch(e){
        console.log(e.message);
        res.status(500).json({message:e.message})
    }
}


export const adminDashboard = async(req, res) =>{
    try{
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const categoryCount = await Category.countDocuments();
        const orderCount = await Order.countDocuments();
        
        res.status(200).json({
            userCount,
            productCount,
            categoryCount,
            orderCount
        })
    }catch(e){
        console.log(e.message);
        res.status(500).json({message:e.message})
    }
}