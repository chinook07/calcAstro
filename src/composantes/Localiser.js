import styled from "styled-components";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AstroContexte } from "../AstroContexte";
import ListeVilles from "./miniComposantes/ListeVilles";
import CarteCoord from "./miniComposantes/CarteCoord";
import { faArrowRightToCity, faLocationCrosshairs, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const Localiser = () => {

    const { emplacement, setEmplacement } = useContext(AstroContexte);

    const montrerPosition = (position) => {
        console.log(position);
        setEmplacement({"lat": position.coords.latitude, "lng": position.coords.longitude})
    }

    const localMoi = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(montrerPosition);
        } else {
            console.log("erreur");
        }
    }
    return (
        <Wrapper>
            <h2>Votre emplacement</h2>
            <Choix3>
                <form>
                    <label htmlFor="ville">
                        <FontAwesomeIcon icon={faArrowRightToCity} />
                        <span> Observation à partir d'une grande ville : </span>
                    </label>
                    <ListeVilles />
                </form>
                <div>
                    <p>
                        <FontAwesomeIcon icon={faMapLocationDot} />
                        <span> Choix à partir de la carte :</span>
                    </p>
                    <CarteCoord />
                </div>
                <div>
                    <p>
                        <FontAwesomeIcon icon={faLocationCrosshairs} />
                        <span> Géolocalisation automatique</span>
                    </p>
                    <button onClick={localMoi}>Trouver mon emplacement</button>
                </div>
            </Choix3>
            {
                emplacement && emplacement.lat && <p>Coordonnées trouvées : {emplacement.lat}, {emplacement.lng}</p>
            }
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