import Prodotti from "./Prodotti";
import classes from "../ComponentsCss/Ricerca.module.css"
export default function Ricerca({ testo }) {
   

    return (
        <main>
            <div style={{ marginBottom: '1.5rem' }}>
                <div className={classes["h2"]}  style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    Risultati per: <span style={{ fontWeight: 'normal' }}>{testo}</span>
                </div>
            </div>
            <Prodotti/>
        </main>
    );
}
