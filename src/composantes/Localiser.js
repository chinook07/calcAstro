import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListeVilles from "./miniComposantes/ListeVilles";
import EntreeCoord from "./miniComposantes/EntreeCoord";
import CarteCoord from "./miniComposantes/CarteCoord";

const Localiser = () => {

    const localMoi = () => {
        
    }
    return (
        <Wrapper>
            <h2>Votre emplacement</h2>
            <Choix3>
                <div>
                    <p>Choisissez une ville parmi cette liste :</p>
                    <ListeVilles />
                </div>
                <div>
                    <p>Choisissez votre lieu sur la carte.</p>
                    <CarteCoord />
                </div>
                <div>
                    <p>Ou géolocalisez-moi.</p>
                    <button onClick={localMoi}>Trouver mon emplacement</button>
                </div>
            </Choix3>
            <EntreeCoord />
            
            
        </Wrapper>
    )
}

const Wrapper = styled.div``

const Choix3 = styled.div`
    display: flex;
    flex-direction: column;
    /* justify-content: space-around; */
`

export default Localiser;