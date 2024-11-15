import styled from "styled-components";
import { useContext } from "react";

import liste from "../../donnees/villes.json";
import { AstroContexte } from "../../AstroContexte";

const ListeVilles = () => {

    const { setEmplacement } = useContext(AstroContexte);

    const choisirVille = (ville) => {
        console.log(ville);
        setEmplacement({"lat": ville.lat, "lng": ville.lng})
    }

    return (
        <Wrapper
            defaultValue=""
            name="ville"
            onChange={(e) => {
                let choix = liste[e.target.selectedIndex - 1];
                choisirVille(choix)
            }}
        >
            <option disabled value="">Choisir</option>
            {
                liste.map((item, index) => {
                    return (
                        <option
                            key={index}
                            value={{ "lat": item.lat, "lng": item.lng }}
                        >{item.ville}
                        </option>
                    )
                })
            }
        </Wrapper>
    )
}

const Wrapper = styled.select``

export default ListeVilles;