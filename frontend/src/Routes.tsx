import React from "react";
import {Routes , Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";


//placeholder components for now 
const HomePage = () => <h1>Home Page (Public)</h1>;
const LoginPage = ()=> <h1>Login Page </h1>
const RegisterPage = () => <h1>Register Page </h1>
const DashboardPage = () => <h1>Dashboard(Protected)</h1>
const AdminPage = () => <h1>Admin Page(Protected - Admin Only)</h1>



const AppRoutes : React.FC=()=>{
    const isAuthenticated = false;
    const userRole = 'user';

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            

            //Protected Routes 
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated}/>}>
               <Route path="/dashboard" element={<DashboardPage />} />
            //example of role based protection can be redefined with actual roles
               {userRole === 'admin' && <Route path="/admin" element={<AdminPage />} />}
            </Route>


            <Route path="*" element={<h1>404 Not Found</h1>} />  
        </Routes>
    )
}


export default AppRoutes;