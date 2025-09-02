import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asynchandler from "express-async-handler";
import crypto from "crypto"


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken =() =>{
  return crypto.randomBytes(64).toString('hex') ;// generates the refresh token
}


const sendRefreshToken=(res,token)=>{
  res.cookie('refreshToken' , token , {
    httpOnly : true,
    secure: process.env.NODE_ENV === "production", // uses secure cookie in pr0duction
    sameSite: "strict" , 
    maxAge : 7*24*60*60*1000, //7 days (your desired refresh token lifespan)
  })
}


//Register user
export const registerUser = asynchandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  //check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user"
  });

  if (user) {
     const newRefreshToken = generateRefreshToken();
     user.refreshToken =  newRefreshToken; //store refresh token in db
     await user.save() ;  // saves the updated user with refresh token 

     sendRefreshToken(res,newRefreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});


//login User 

export const loginUser = asynchandler(async(req,res)=>{
    const {email, password} = req.body;


    //find user
   const user = await User.findOne({email});
   if(!user){
    res.status(400);
    throw new Error("Invalid Credentials");
   }
//check password 
const isMatch  = await bcrypt.compare(password, user.password);
if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials")
}
  const newRefreshToken = generateRefreshToken() ; 
  user.refreshToken = newRefreshToken ; 
  await  user.save() ; 


  sendRefreshToken(res,newRefreshToken) ; 


res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),

});

})

 export const refreshAccessToken = asynchandler(async(req,res)=>{
 const cookies= req.cookies;
 if(!cookies?.refreshToken){
  res.status(401);
  throw new Error("no refresh token found , Unauthorized")
 }
 const refreshToken = cookies.refreshToken;

 const user = await User.findOne({refreshToken}); 

 if(!user) {
  res.status(403);
  throw new Error("Refresh token is invalid or not found for a user")

 }

const newAccessToken= generateToken(user._id, user.role);

res.json({token : newAccessToken})

})
