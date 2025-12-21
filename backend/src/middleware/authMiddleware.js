import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


export const protect = async(req, res, next) =>{
    let token;
    // authorization header ya start with Bearer if get a token system 
    // if{ token split 1, -> decode , -> contex password -> next()
    // }
    if(req.headers.authorization?.startsWith("Bearer")){
        try{
            // get token  from header
            token = req.headers.authorization.split(" ")[1];
            // verify token
            const decoder = jwt.verify(token, process.env.JWT_SECRET);

            // add user context without password 
            req.user = await User.findById(decoder.id).select("-password");

            next();

        }catch(e){
            res.status(401);
            throw new Error("not Authorized, failed token")
        }
    } else{
        res.status(401).json({message: "Not Autorized, plz login"})
    }
}

export const admin = (req, res, next)=>{
    //check weather given user is admin 
    if(req.user && req.user.role==="admin"){
        next()
    }else{
        res.status(401);
        throw new Error("Not Admin so you are not authorized")
    }
}