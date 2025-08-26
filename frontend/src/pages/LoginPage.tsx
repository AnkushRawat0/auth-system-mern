import React from "react" ;
import {useForm ,type SubmitHandler} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod" 
import {Link} from "react-router-dom"


//defining zod schema for login form
const loginSchema = z.object({
    email: z.string().email("invalid email adress"),
    password :z.string().min(6 , "password mush be at least 6 characters"),
});


//infering the typescript type from schema 
type LoginFormInputs = z.infer<typeof loginSchema>


const LoginPage : React.FC =() =>{
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),

    })

    const onSubmit : SubmitHandler<LoginFormInputs> = (data)=>{
        console.log(data);
        //here we send data to backend for authentication
        
    };
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              id="email"
              {...register('email')} // Simplified register, validation now handled by Zod
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            {errors.email && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.email.message}</p>}
          </div>
  
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              id="password"
              {...register('password')} // Simplified register, validation now handled by Zod
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            {errors.password && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.password.message}</p>}
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  
    )
}

export default LoginPage; 