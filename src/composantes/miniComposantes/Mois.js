import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, lastDayOfMonth, getMonth, getYear, getDaysInMonth, isAfter } from "date-fns";
import { fr } from "date-fns/locale";

import { AstroContexte } from "../../AstroContexte";

const Mois = ({ moisAMontrer, prochainMois }) => {

    // console.log(moisAMontrer, prochainMois);

    const { date } = useContext(AstroContexte);
    const [donneesSoleil, setDonneesSoleil] = useState();
    const [donneesLune, setDonneesLune] = useState();
    const [cielNoir, setCielNoir] = useState([]);

    const nDeJrs = getDaysInMonth(new Date(moisAMontrer.annee, moisAMontrer.mois - 1)); // modifier
    let tousJours = [];
    for (let j = 1; j <= nDeJrs; j++) {
        tousJours.push(j)
    }

    const chercherSoleil = async (e) => {
        try {
            const res = await fetch(`https://api.sunrisesunset.io/json?lat=38.907192&lng=-77.036873&date_start=${moisAMontrer.annee}-${moisAMontrer.mois}-01&date_end=${prochainMois.annee}-${prochainMois.mois}-01&time_format=24`);
            const donnees = await res.json();
            setDonneesSoleil(donnees.results);

            const luneDataArray = new Array(donnees.results.length);

            await Promise.all(
                donnees.results.map(async (item, index) => {
                    const res = fetch(`https://aa.usno.navy.mil/api/rstt/oneday?date=${item.date} &coords=41.89, 12.48`)
                    const luneDonnees = await (await res).json();
                    luneDataArray[index] = luneDonnees.properties.data;
                })
            );
            setDonneesLune(luneDataArray);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        moisAMontrer.annee && chercherSoleil()
    }, [moisAMontrer])
    
    let cielNoirArray = donneesSoleil;

    let cielNoirTableau = [];

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
    
    const lumLune = () => {
        if (donneesLune !== undefined) {
            donneesLune.forEach((item, index) => {
                if (item.curphase === "Waxing Gibbous" || item.curphase === "Full Moon" || item.curphase === "Waning Gibbous") {
                    // cielNoirArray[index].heuresLune = item.moondata;
                    item.moondata.forEach(item => {
                        if (item.phen === "Rise") cielNoirArray[index].leverLune = item.time
                        if (item.phen === "Set") cielNoirArray[index].coucherLune = item.time
                    })
                }
            });
        }
    }

    useEffect(() => {
        lumLune();
        setCielNoir(cielNoirTableau);
    }, [donneesLune])

    if (donneesSoleil !== undefined && donneesLune !== undefined && cielNoir && cielNoir.length) {
        // console.log(donneesLune, donneesSoleil);
        return (
            <Wrapper>
                <thead>
                    <tr>
                        <th>{format(date, "MMMM", { locale: fr })}</th>
                        <th>Coucher de soleil</th>
                        <th>Coucher de lune</th>
                        <th>Lune</th>
                        <th>Lever de lune</th>
                        <th>Lever de soleil</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tousJours.map((item, index) => {
                            return (
                                <Rangee
                                    key={index}
                                    $fond={cielNoir[index].pollution && !cielNoir[index].luneAllo && !cielNoir[index].luneBye ? "--c5" : "--c1"}
                                    $couleur={cielNoir[index].pollution && !cielNoir[index].luneAllo && !cielNoir[index].luneBye ? "--c0" : "--c3"}
                                >
                                    <td>{item}</td>
                                    <td>{donneesSoleil[index].last_light.slice(0,5).replace(":", " h ")}</td>
                                    <td>{cielNoir[index].luneBye.replace(":", " h ")}</td>
                                    <td>
                                        {
                                            (donneesLune[index].fracillum >= "50 %" || donneesLune[index].fracillum === "100%") && donneesLune[index].fracillum.length > 2 ? <span>{donneesLune[index].fracillum}</span> : <span>{donneesLune[index].fracillum}</span>
                                        }
                                    </td>
                                    <td>{cielNoir[index].luneAllo.replace(":", " h ")}</td>
                                    <td>{donneesSoleil[index + 1].first_light.slice(0,5).replace(":", " h ")}</td>
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