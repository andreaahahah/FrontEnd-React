import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalContext/AuthContext";
import SignUp from "../Components/SignUp";


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
                <SignUp/>
            )}
        </>
    );
}

export default LoginPage;