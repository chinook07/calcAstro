import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, getDaysInMonth } from "date-fns";
import { fr } from "date-fns/locale";

import { AstroContexte } from "../../AstroContexte";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { faArrowDown, faArrowUp, faPercent } from "@fortawesome/free-solid-svg-icons";

const Mois = ({ moisAMontrer, prochainMois }) => {

    const { date, emplacement } = useContext(AstroContexte);
    const [donneesSoleil, setDonneesSoleil] = useState();
    const [donneesLune, setDonneesLune] = useState();
    const [cielNoir, setCielNoir] = useState([]);
    const [listeJours, setListeJours] = useState();

    const trouverNdeJours = () => {
        const nDeJrs = getDaysInMonth(new Date(moisAMontrer.annee, moisAMontrer.mois - 1)); // modifier
        let tousJours = [];
        for (let j = 1; j <= nDeJrs; j++) {
            tousJours.push(j)
        }
        setListeJours(tousJours);
    }

    const chercherSoleil = async (e) => {
        try {
            const res = await fetch(`https://api.sunrisesunset.io/json?lat=${emplacement.lat}&lng=${emplacement.lng}&date_start=${moisAMontrer.annee}-${moisAMontrer.mois}-01&date_end=${prochainMois.annee}-${prochainMois.mois}-01&time_format=24`);
            const donnees = await res.json();
            setDonneesSoleil(donnees.results);

            const luneDataArray = new Array(donnees.results.length);

            await Promise.all(
                donnees.results.map(async (item, index) => {
                    const res = fetch(`https://aa.usno.navy.mil/api/rstt/oneday?date=${item.date}&coords=${emplacement.lat},${emplacement.lng}&tz=-5&dst=true`)
                    const luneDonnees = await (await res).json();
                    luneDataArray[index] = luneDonnees.properties.data;
                })
            );
            setDonneesLune(luneDataArray);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const phasesLune = () => {
        let cielNoirTableau = donneesSoleil;

        // let cielNoirTableau = [];

        if (donneesSoleil && donneesLune) {
            for (let jr = 0; jr < donneesSoleil.length - 1; jr++) {
                cielNoirTableau.push({
                    "date": donneesSoleil[jr].date,
                    "nuitDebut": donneesSoleil[jr].last_light,
                    "luneBye": "",
                    "luneAllo": "",
                    "nuitFin": donneesSoleil[jr + 1].first_light,
                    "pourcentage": donneesLune[jr].fracillum,
                    "pollution": false
                })
                if (donneesLune[jr].curphase === "Waxing Gibbous" || donneesLune[jr].curphase === "Full Moon" || donneesLune[jr].curphase === "Waning Gibbous") {
                    cielNoirTableau[jr].pollution = true
                }
                donneesLune[jr].moondata.forEach(item => {
                    if (item.phen === "Set" && item.time > cielNoirTableau[jr].nuitDebut) {
                        cielNoirTableau[jr].luneBye = item.time
                    }
                    if (item.phen === "Set" && item.time < cielNoirTableau[jr].nuitDebut && cielNoirTableau[jr-1] && item.time < cielNoirTableau[jr-1].nuitFin) {
                        cielNoirTableau[jr-1].luneBye = item.time
                    }
                    if (item.phen === "Rise" && item.time > cielNoirTableau[jr].nuitDebut) {
                        cielNoirTableau[jr].luneAllo = item.time
                    }
                    if (item.phen === "Rise" && cielNoirTableau[jr-1] && item.time < cielNoirTableau[jr-1].nuitDebut && item.time < cielNoirTableau[jr-1].nuitFin) {
                        cielNoirTableau[jr-1].luneAllo = item.time
                    }
                })
            }
        }
        setCielNoir(cielNoirTableau);
    }

    const lumLune = () => {
        if (donneesLune !== undefined) {
            donneesLune.forEach((item, index) => {
                if (item.curphase === "Waxing Gibbous" || item.curphase === "Full Moon" || item.curphase === "Waning Gibbous") {
                    // cielNoirArray[index].heuresLune = item.moondata;
                    item.moondata.forEach(item => {
                        if (item.phen === "Rise") cielNoir[index].leverLune = item.time
                        if (item.phen === "Set") cielNoir[index].coucherLune = item.time
                    })
                }
            });
        }
    }

    useEffect(() => {
        if (emplacement.lat && moisAMontrer.annee) {
            console.log("je cherche soleil");
            chercherSoleil()
            console.log("je cherche n de jours");
            trouverNdeJours()
            console.log("je cherche phases de lune");
            phasesLune()
            console.log("je cherche lun de lune");
            lumLune()
        }
    }, [moisAMontrer, emplacement])
    

    // zones polaires!


    if (donneesSoleil !== undefined && donneesLune !== undefined && cielNoir && cielNoir.length) {
        console.log(donneesLune, donneesSoleil);
        return (
            <Wrapper>
                <caption>Calendrier de {format(date, "MMMM yyyy", { locale: fr })}</caption>
                <thead>
                    <tr>
                        <th></th>
                        <th><FontAwesomeIcon icon={faSun} /> <FontAwesomeIcon icon={faArrowDown} /></th>
                        <th><FontAwesomeIcon icon={faMoon} /> <FontAwesomeIcon icon={faArrowDown} /></th>
                        <th><FontAwesomeIcon icon={faMoon} /> <FontAwesomeIcon icon={faPercent} /></th>
                        <th><FontAwesomeIcon icon={faMoon} /> <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th><FontAwesomeIcon icon={faSun} /> <FontAwesomeIcon icon={faArrowUp} /></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listeJours.map((item, index) => {
                            return (
                                <Rangee
                                    key={index}
                                    $fond={cielNoir[index].pollution && !cielNoir[index].luneAllo && !cielNoir[index].luneBye ? "--c5" : "--c1"}
                                    $couleur={cielNoir[index].pollution && !cielNoir[index].luneAllo && !cielNoir[index].luneBye ? "--c0" : "--c3"}
                                >
                                    <td>{item}</td>
                                    {
                                        donneesSoleil[index].last_light
                                            ? <td>{donneesSoleil[index].last_light.slice(0, 5).replace(":", " h ")}</td>
                                            : <td>N/D</td>
                                    }
                                    <td>{cielNoir[index].luneBye.replace(":", " h ").replace(" ST", "").replace(" DT", "")}</td>
                                    <td>
                                        {
                                            (donneesLune[index].fracillum >= "50 %" || donneesLune[index].fracillum === "100%") && donneesLune[index].fracillum.length > 2 ? <span>{donneesLune[index].fracillum}</span> : <span>{donneesLune[index].fracillum}</span>
                                        }
                                    </td>
                                    <td>{cielNoir[index].luneAllo.replace(":", " h ").replace(" ST", "").replace(" DT", "")}</td>
                                    {
                                        donneesSoleil[index + 1].first_light
                                            ? <td>{donneesSoleil[index + 1].first_light.slice(0,5).replace(":", " h ")}</td>
                                            : <td>N/D</td>
                                    }
                                </Rangee>
                            )
                        })
                    }
                </tbody>
            </Wrapper>
        )
    }
}

const Wrapper = styled.table`
    border: 1px solid var(--c2);
    caption {
        font-weight: bold;
        margin: 10px auto;
    }
    td {
        border: 1px dashed var(--c0);
        padding: 5px;
    }
`

const Rangee = styled.tr`
    background-color: var(${props => props.$fond});
    
    td {
        color: var(${props => props.$couleur});
        span {
            color: var(${props => props.$couleur});
        }
    }
`

export default Mois;