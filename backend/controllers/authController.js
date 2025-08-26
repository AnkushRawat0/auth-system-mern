import User from "../models/User.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asynchandler from "express-async-handler";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};



//Register user
export const registerUser = asynchandler(async (req, res) => {
  const { name, email, password } = req.body;

  //check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bycrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash(password, salt);

  const user = await User.createe({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
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
const isMatch  = await bycrypt.compare(password, user.password);
if (!isMatch) {
    res.status(400);
    throw new Error("Invakid credentials")
}

res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),

});

})
