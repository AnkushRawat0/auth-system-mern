import jwt from "jsonwebtoken" ;
import asynchandler from "express-async-handler" ;
import User from "../models/User.js";


export const protect = asynchandler(async(req , res , next)=>{
    let token;



    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token , process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            next();
        }catch(error){
            res.status(404) ; 
            throw new Error("not authorized , token failed")
        }
    }
    if(!token){
        res.status(401) ;
        throw new Error("not  authorized , no token")
    }
})


// role based middleware 

export const admin = (req,res,next) => {
    if(req.user && req.user.role==="admin"){
        next()
    }else{
        res.status(403);
        throw new Error("Admin access only")
    }
}
