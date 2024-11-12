import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListeVilles from "./miniComposantes/ListeVilles";
import EntreeCoord from "./miniComposantes/EntreeCoord";

const Localiser = () => {
    return (
        <Wrapper>
            <h2>Votre emplacement</h2>
            <Choix3>
                <div>
                    <p>Choisissez une ville parmi cette liste :</p>
                    <ListeVilles />
                </div>
                <div>
                    <p>Entrez vos coordonnées (format décimal)</p>
                    <EntreeCoord />
                </div>
                <div>
                    <p>Ou géolocalisez-moi.</p>
                    <button>Trouver mon emplacement</button>
                </div>
            </Choix3>
            
            
            
        </Wrapper>
    )
}

const Wrapper = styled.div``

const Choix3 = styled.div`
    display: flex;
`

export default Localiser;