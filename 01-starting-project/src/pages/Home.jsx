import Categories from "../Components/Categorie";
import Prodotti from "../Components/Prodotti";

function  HomePage(){
    return(
        < div >
            <div style={{ marginTop: '50px' }}>
            <Categories /> 
            </div>
            <h2>ESPLORA LA NOSTRA VETRINA</h2>

            <Prodotti searchText="vetrina" style={{ marginTop: '500px' }}/>
            
            
            
        </div>
    )

}
export default HomePage;