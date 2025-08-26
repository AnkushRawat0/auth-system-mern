import React, {createContext , useState , useEffect , useContext , type ReactNode} from "react" ;
import axios from "axios";
import { useNavigate } from "react-router-dom";


//defining user schema 
interface User {
    _id : string;
    name:string;
    email : string;
    role: string;
}

//defininh authcontext type 
interface AuthContextType {
    user : User | null ;
    token :string | null ;
    login: (email: string , password:string) => Promise<void>;
    register: (name:string , email : string , password : string , role:string) =>Promise<void>;
    logout: ()=> void;
    isAuthenticated :boolean ; 
    isLoading : boolean;


}

//creating the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined) ;


interface AuthProviderProps{
    children : ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user,setUser] = useState<User | null>(null) ; 
    const [token,setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isloading , setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();


//setting default axios for headers for authorization 
useEffect(()=>{
    if(token){
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        fetchUserData(token);
    }else{
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setIsLoading(false);
    }
},[token])

}