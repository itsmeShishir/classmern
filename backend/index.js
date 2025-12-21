import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from "./src/config/dbconfig.js";

dotenv.config();

// Connect DB
connectDB();

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});