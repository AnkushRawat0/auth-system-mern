import React from "react";
import { useForm , type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../styles/Forms.css'; // Import the new CSS file


//defined zod schema for register form

const registerSchema = z.object({
    name: z.string().min(3,"Name must have atleast 3 characters"),
    email: z.string().email("invalid email adress"),
    password: z.string().min(6, "password must be atleast 6 characters"),
    confirmPassword: z.string().min(6, "confirm password must be atleasr 6 charactes"),
    role: z.enum(['user' , 'admin']),
}).refine((data)=>data.password === data.confirmPassword,{
    message: "password do not match" , 
    path: ["confirmPassword"], //path where error will be attached 
})


//infer the typescript type from the schema 

type RegisterFormInputs = z.infer<typeof registerSchema>


const RegisterPage :React.FC = () =>{
    const { register: authRegister } = useAuth();

    const {
        register ,
        handleSubmit,
        formState: {errors},
      }= useForm<RegisterFormInputs>({
        resolver : zodResolver(registerSchema ),
        defaultValues:{
            role: "user"
        },
    });

    const onSubmit: SubmitHandler<RegisterFormInputs> = async(data)=>{
        try{
            await authRegister(data.name , data.email , data.password , data.role);
        }catch(error){
         console.error("registration failed" , error);
         alert("Registration failed. Please try again")
         
        }
        
    };

    return (
        <div className="form-container"> {/* Use class name */} 
      <h2 className="text-center">Register</h2> {/* Use class name */} 
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group"> {/* Use class name */} 
          <label htmlFor="name" className="form-label">Name:</label> {/* Use class name */} 
          <input
            type="text"
            id="name"
            {...register('name')}
            className="form-input" // Use class name
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>} {/* Use class name */} 
        </div>

        <div className="form-group"> {/* Use class name */} 
          <label htmlFor="email" className="form-label">Email:</label> {/* Use class name */} 
          <input
            type="email"
            id="email"
            {...register('email')}
            className="form-input" // Use class name
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>} {/* Use class name */} 
        </div>
     
       
        <div className="form-group"> {/* Use class name */} 
          <label htmlFor="password" className="form-label">Password:</label> {/* Use class name */} 
          <input
            type="password"
            id="password"
            {...register('password')}
            className="form-input" // Use class name
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>} {/* Use class name */} 
        </div>

        <div className="form-group"> {/* Use class name */} 
          <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label> {/* Use class name */} 
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className="form-input" // Use class name
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>} {/* Use class name */} 
        </div>

        <div className="form-group"> {/* Use class name */} 
          <label htmlFor="role" className="form-label">Role:</label> {/* Use class name */} 
          <select
            id="role"
            {...register('role')}
            className="form-input" // Use class name
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.role.message}</p>} {/* Use class name */} 
        </div>


        <button type="submit" className="btn btn-primary"> {/* Use class names */} 
          Register
        </button>
      </form>
      <p className="form-footer-text"> {/* Use class name */} 
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>

    )
}
export default RegisterPage;