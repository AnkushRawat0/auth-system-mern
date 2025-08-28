import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

//Root Route 
app.get("/" , (req,res)=>{
    res.send("API is running ")
})


//error handler middleware 
app.use((err,req,res,next)=>{
    const statusCode = res.statusCode == 200 ? 500 :res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message , 
        stack:process.env.NODE_ENV === "production" ? null :err.stack,
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
