import { useContext, useState } from "react";
import { AuthContext } from "../GlobalContext/AuthContext";
import classes from "../ComponentsCss/Login.module.css"

export default function Login(){

    const { isAuthenticated, user, login, logout } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if(email && password){
            login({name:email, password})}
    };
    return (
        <>
        <h1 className={classes["titolo"]}>FAI IL LOGIN</h1>
        <div className={classes["login-container"]}>
            <form className={classes["login-form"]}>
                <input 
                    type="text" 
                    placeholder="Inserisci il nome utente" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className={classes["login-input"]}
                />
                <input 
                    type="password" 
                    placeholder="Inserisci la password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className={classes["login-input"]}
                />
                <button onClick={handleLogin} className={classes["login-button"]}>Login</button>
            </form>
        </div>
        </>
    )
}