import React from "react";
import { useForm , type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";


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

    const onSubmit: SubmitHandler<RegisterFormInputs> = (data)=>{
        console.log(data);
        
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            id="name"
            {...register('name')}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          {errors.name && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.name.message}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.email.message}</p>}
        </div>
     
       
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            {...register('password')}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          {errors.password && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.password.message}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          {errors.confirmPassword && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.confirmPassword.message}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '5px' }}>Role:</label>
          <select
            id="role"
            {...register('role')}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.role.message}</p>}
        </div>


        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>

    )
}