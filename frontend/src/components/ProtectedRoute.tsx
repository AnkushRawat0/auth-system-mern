import React from "react";
import { Navigate , Outlet } from "react-router-dom";



interface ProtectedRouteProps{
    isAuthenticated : boolean ;
    children?: React.ReactNode;
}

const ProtectedRoute = ({ isAuthenticated ,children}: ProtectedRouteProps)=>{
    if(!isAuthenticated){
        return <Navigate to="login" replace />

    }
    return children || <Outlet />
}

export default ProtectedRoute ; 

