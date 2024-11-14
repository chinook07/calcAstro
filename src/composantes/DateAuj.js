import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { AstroContexte } from "../AstroContexte";
import Mois from "./miniComposantes/Mois";

const DateAuj = () => {

    const { date, pret } = useContext(AstroContexte);

    const [dateForm, setDateForm] = useState("")

    useEffect(() => {
        if (date !== undefined) {
            setDateForm(format(date, "dd MMMM", { locale: fr }));
        }
    }, [date])

    if (pret) {
        return (
            <Wrapper>
                <h2>Calendrier</h2>
                <p>Nous sommes le {dateForm}.</p>
                <button>Mois précédent</button>
                <Mois />
                <button>Mois suivant</button>
            </Wrapper>
        )
    }
    
}

const Wrapper = styled.div``

export default DateAuj;