import React from "react" ;
import {useForm ,type SubmitHandler} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod" 
import {Link} from "react-router-dom"
import { useAuth } from '../context/AuthContext';
import '../styles/Forms.css'; // Import the new CSS file


//defining zod schema for login form
const loginSchema = z.object({
    email: z.string().email("invalid email adress"),
    password :z.string().min(6 , "password mush be at least 6 characters"),
});


//infering the typescript type from schema 
type LoginFormInputs = z.infer<typeof loginSchema>


const LoginPage : React.FC =() =>{
    const { login } = useAuth(); // Use the useAuth hook


    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),

    })

    const onSubmit : SubmitHandler<LoginFormInputs> = async(data)=>{
       try{
        await login(data.email,data.password);
       }catch(error){
        console.error("login failed", error);
        alert("login failed please check your credentials")
        
       }
    };
    return (
        <div className="form-container"> {/* Use class name */} 
        <h2 className="text-center">Login</h2> {/* Use class name */} 
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group"> {/* Use class name */} 
            <label htmlFor="email" className="form-label">Email:</label> {/* Use class name */} 
            <input
              type="email"
              id="email"
              {...register('email')} // Simplified register, validation now handled by Zod
              className="form-input" // Use class name
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>} {/* Use class name */} 
          </div>
  
          <div className="form-group"> {/* Use class name */} 
            <label htmlFor="password" className="form-label">Password:</label> {/* Use class name */} 
            <input
              type="password"
              id="password"
              {...register('password')} // Simplified register, validation now handled by Zod
              className="form-input" // Use class name
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>} {/* Use class name */} 
          </div>
          <button type="submit" className="btn btn-primary"> {/* Use class names */} 
          Login
        </button>
      </form>
      <p className="form-footer-text"> {/* Use class name */} 
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  
    )
}

export default LoginPage; 