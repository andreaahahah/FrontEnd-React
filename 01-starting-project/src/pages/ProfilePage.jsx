import { Link } from "react-router-dom"
import classes from "../cssPages/Profile.module.css"
import { AuthContext } from "../GlobalContext/AuthContext";
import { useContext } from "react";

function  ProfilePage(){

    const { isAuthenticated, user, login, logout } = useContext(AuthContext);

    console.log(user);

    const handleLogOut=()=>{
        logout();
    }

    return(
        <> 
          
            {isAuthenticated? (

                <div >
                    
                    <button className={classes["logout-btn"]} onClick={handleLogOut}>LOGOUT</button>
                  
                    <h2>BENTORNATO {user?.name} </h2>
                    <h3> {user?.email}</h3> 
                    <h3> {user?.surname}</h3>
                    <h3> {user?.password}</h3>{/**solo per debug */}
                    <div className={classes["buttons-container"]}>
                        <Link to="/iTuoiOrdini">
                            <button className={classes["login-btn"]}>I TUOI ORDINI</button>
                        </Link>
                    </div>

                </div>
            ):(
                <div>
                    <h2>BENVENUTO,</h2>
                    <h3> sembra che al momento tu non sia autenticato</h3>
                    <div className={classes["buttons-container"]}>
                        <Link to="/login">
                            <button className={classes["login-btn"]}>LOGIN</button>
                        </Link>
                        <Link to="/signup">
                            <button className={classes["register-btn"]}>REGISTRATI</button>
                        </Link>
                    </div>
                </div>
            )
            
        }
        
           
        </>
    )

}
export default ProfilePage;