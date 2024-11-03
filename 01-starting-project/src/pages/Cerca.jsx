import { useParams } from "react-router-dom";
import Ricerca from "../Components/Ricerca";

function Cerca(){
    const { searchText } = useParams();
    return(
        <Ricerca testo={searchText}></Ricerca>
    )
}
export default Cerca;