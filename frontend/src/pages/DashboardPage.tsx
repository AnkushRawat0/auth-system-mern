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
                const response = await axios.get("https://localhost:5000/api/auth/profile") ;
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


    return(
        <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Dashboard Page</h1>
      {user && <p>Welcome, {user.name || user.email}!</p>}

      {loadingData ? (
        <p>Loading protected data...</p>
      ) : errorData ? (
        <p style={{ color: 'red' }}>Error: {errorData}</p>
      ) : protectedData ? (
        <div>
          <h2>Protected Data:</h2>
          <p>{protectedData.message}</p>
          {/* Render other protected data here */}
        </div>
      ) : (
        <p>No protected data to display.</p>
      )}

      {/* Add more dashboard specific content here */}
    </div>

    )

}

export default DashboardPage;