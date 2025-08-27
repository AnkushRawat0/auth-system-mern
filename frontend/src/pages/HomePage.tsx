import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



const HomePage :React.FC =()=>{
    const{isAuthenticated , user , logout} = useAuth() ;


    return(
        <div className="page-container"> {/* Use page-container class */} 
        <h1>Welcome to the Home Page!</h1>
        <p>This is a public page accessible to everyone.</p>
  
        {isAuthenticated ? (
          <div className="margin-top-lg"> {/* Example utility class */} 
            <p>Hello, {user?.name || user?.email}!</p>
            <button onClick={logout} className="btn btn-danger">Logout</button> {/* Use btn btn-danger */} 
            <Link to="/dashboard" className="btn btn-secondary margin-left-md">Go to Dashboard</Link> {/* Example: new class for spacing */} 
          </div>
        ) : (
          <div className="margin-top-lg"> {/* Example utility class */} 
            <p>Please log in or register to access more features.</p>
            <Link to="/login" className="btn btn-primary margin-right-md">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
        )}
      </div>

    )
}

export default HomePage ; 