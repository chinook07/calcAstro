import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { AstroContexte } from "../AstroContexte";
import Mois from "./miniComposantes/Mois";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";

const DateAuj = () => {

    const { date, pret } = useContext(AstroContexte);

    const [moisAMontrer, setMoisAMontrer] = useState({});
    const [prochainMois, setProchainMois] = useState({});
    const [dateForm, setDateForm] = useState("")

    useEffect(() => {
        if (date !== undefined) {
            setDateForm(format(date, "dd MMMM", { locale: fr }));
            setMoisAMontrer({
                "annee": format(date, "yyyy"),
                "mois": format(date, "MM")
            })
            if (format(date, "MM") === "12") {
                setProchainMois({
                    "annee": (parseInt(format(date, "yyyy")) + 1).toString(),
                    "mois": format(date, "01")
                })
            } else setProchainMois({
                "annee": format(date, "yyyy"),
                "mois": (parseInt(format(date, "MM")) + 1).toString()
            })
        }
    }, [date])

    const moisPrecedent = () => {
        
    }

    const moisProchain = () => {
        setMoisAMontrer(prochainMois)
        if (prochainMois.mois === "12") {
            setProchainMois({
                "annee": (parseInt(prochainMois.annee) + 1).toString(),
                "mois": "01"
            })
        } else {
            let nouveauMois = (parseInt(prochainMois.mois) + 1).toString();
            if (nouveauMois.length === 1) nouveauMois = "0" + nouveauMois
            setProchainMois({
                "annee": prochainMois.annee,
                "mois": nouveauMois
            })
        }
    }

    if (pret) {
        return (
            <Wrapper>
                <h2>Calendrier</h2>
                <p>
                    <FontAwesomeIcon icon={faCalendarDay} />
                    <span> Nous sommes le {dateForm}.</span>
                </p>
                <button onClick={moisPrecedent}>Mois précédent</button>
                <Mois moisAMontrer={moisAMontrer} prochainMois={prochainMois} />
                <button onClick={moisProchain}>Mois suivant</button>
            </Wrapper>
        )
    }
    
}

const Wrapper = styled.div``

export default DateAuj;