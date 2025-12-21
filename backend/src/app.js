import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";


import userRoutes from "../src/routes/userRoute.js";
import categoryRoutes from "../src/routes/categoryRoute.js";
import ProductRoutes from "../src/routes/productRoute.js";
import orderRoutes from "../src/routes/orderRoute.js";
import paymentRoutes from "../src/routes/paymentRoute.js";
const app = express();

// ES6 fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json());
app.use(cors());
// enable cors for 
app.use(helmet());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")))


// Routes 
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", ProductRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Test Route
app.get("/",(req, res)=>{
    // get -> browser -> server ask data -> res-> browser 
    res.status(200).json({message: "your server is working "})
});


export default app;