import express from "express";
import { registerUser, loginUser, refreshAccessToken } from "../controllers/authController.js";
import { protect , admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh" , refreshAccessToken)

//example protected route 
router.get("/profile", protect , (req,res)=>{
    res.json({message: "this is your profile" , user: req.user})
});

//example admin route 
router.get("/admin" , protect ,admin , (req,res)=>{
    res.json({message: "admin access granted"})
});



export default router;
