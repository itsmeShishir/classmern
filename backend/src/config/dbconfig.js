import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MONGODB CONNECT: ${conn.connection.host}`)
    }catch(e){
        console.log(`Error: ${e.message}`);
        process.exit(1);
    }
}

export default connectDB;