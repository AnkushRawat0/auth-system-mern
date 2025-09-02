import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

interface ProtectedData{
    message:string;
}

const DashboardPage : React.FC = () =>{
    const {user,token} = useAuth() ; 
    const [protectedData ,setProtectedData] = useState<ProtectedData | null>(null) ; 
    const [loadingData , setLoadingData] =  useState<boolean>(true) ; 
    const[errorData  , setErrorData] = useState<string | null> (null) ; 



    useEffect(()=>{
        const fetchProtectedData = async() =>{
            try{
                setLoadingData(true) ; 
                const response = await axiosInstance.get("/auth/profile") ; // Use axiosInstance
                setProtectedData(response.data) ;

            }catch(error :any){
                console.error("failed to fetch protected data:" , error);
                setErrorData(error.response?.data?.message || "failed to load protected data ");

                
            }finally{
                setLoadingData(false);
            }
        };


        if(token) {
            fetchProtectedData();
        }
    },[token]); 

    let content;
    if (loadingData) {
      content = <p>Loading protected data...</p>;
    } else if (errorData) {
      content = <p className="error-message">Error: {errorData}</p>;
    } else if (protectedData) {
      content = (
        <>
          <h2>Protected Data:</h2>
          <p>{protectedData?.message}</p>
          {/* Render other protected data here */}
        </>
      );
    } else {
      content = <p>No protected data to display.</p>;
    }


    return(
        <div className="page-container text-center"> {/* Use page-container and text-center classes */} 
      <h1>Dashboard Page</h1>
      {user && <p>Welcome, {user.name || user.email}!</p>}

      {content}

      {/* Admin navigation - only seen by admin users */}

      {user?.role === "admin" &&(
        <div className="margin-top-lg">
          <h3>Admin Access</h3>
          <Link to="/admin" className = "btn btn-secondary">Go to Admin Page</Link>
           </div>
      )}
      <br />

           <Link to="/" className="btn btn-secondary ">
       Go to Homepage
      </Link>
    
      </div>

    )

}

export default DashboardPage;