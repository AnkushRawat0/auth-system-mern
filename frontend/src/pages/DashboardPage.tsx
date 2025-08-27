import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";


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
                const response = await axios.get("http://localhost:5000/api/auth/profile") ;
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

      {/* Add more dashboard specific content here */}
    </div>

    )

}

export default DashboardPage;