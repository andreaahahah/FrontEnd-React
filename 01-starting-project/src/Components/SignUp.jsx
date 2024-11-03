import { useContext, useState } from "react";
import classes from "../ComponentsCss/SignUp.module.css"
import { AuthContext } from "../GlobalContext/AuthContext";

function  SignUp(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, SetName] = useState('');
    const [surname, setSurname] = useState('');
    const { isAuthenticated, user, login, logout } = useContext(AuthContext);

    const handleSignUp=()=>{
        if(email && password && name && surname){
        login({email:email,password:password,name:name,surname:surname})}
        
    }

    return(
        <>
            <h1 className={classes["titolo"]}>REGISTRATI</h1>
            <div className={classes["signUp-container"]}>
                 
                <form className={classes["signUp-form"]}>
                <input 
                    type="text" 
                    placeholder="Inserisci l'e-mail" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className={classes["signUp-input"]}
                />
                <input 
                    type="password" 
                    placeholder="Inserisci la password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className={classes["signUp-input"]}
                />
                <input 
                    type="text" 
                    placeholder="Inserisci il nome " 
                    value={name} 
                    onChange={(e) => SetName(e.target.value)} 
                    className={classes["signUp-input"]}
                />
                <input 
                    type="text" 
                    placeholder="Inserisci il cognome" 
                    value={surname} 
                    onChange={(e) => setSurname(e.target.value)} 
                    className={classes["signUp-input"]}
                />                
                <button onClick={handleSignUp} className={classes["signUp-button"]}>REGISTRATI</button>

                </form>
            </div>
        </>
    )

}
export default SignUp;