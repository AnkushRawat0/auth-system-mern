import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



const HomePage :React.FC =()=>{
    const{isAuthenticated , user , logout} = useAuth() ;


    return(
        <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome to the Home Page!</h1>
        <p>This is a public page accessible to everyone.</p>
  
        {isAuthenticated ? (
          <div>
            <p>Hello, {user?.name || user?.email}!</p>
            <button onClick={logout} style={{ padding: '10px 20px', margin: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            <Link to="/dashboard" style={{ margin: '10px', color: '#007bff', textDecoration: 'none' }}>Go to Dashboard</Link>
          </div>
        ) : (
          <div>
            <p>Please log in or register to access more features.</p>
            <Link to="/login" style={{ margin: '10px', color: '#007bff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ margin: '10px', color: '#007bff', textDecoration: 'none' }}>Register</Link>
          </div>
        )}
      </div>

    )
}

export default HomePage ; 