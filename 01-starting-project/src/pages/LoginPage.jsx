import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalContext/AuthContext";
import Login from "../Components/Login";


function  LoginPage(){
    const { isAuthenticated, user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile');
        }
    }, [isAuthenticated, navigate]);
    return (
        <> 
            {!isAuthenticated && (
                <Login/>
            )}
        </>
    );
}

export default LoginPage;