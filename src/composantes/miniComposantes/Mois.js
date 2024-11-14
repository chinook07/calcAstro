import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, lastDayOfMonth, getMonth, getYear, getDaysInMonth, isAfter } from "date-fns";
import { fr } from "date-fns/locale";

import { AstroContexte } from "../../AstroContexte";

const Mois = () => {

    const { date } = useContext(AstroContexte);
    const [donneesSoleil, setDonneesSoleil] = useState();
    const [donneesLune, setDonneesLune] = useState();
    const [cielNoir, setCielNoir] = useState([]);

    const nDeJrs = getDaysInMonth(date);
    let tousJours = [];
    for (let j = 1; j <= nDeJrs; j++) {
        tousJours.push(j)
    }

    const chercherSoleil = async (e) => {
        try {
            const res = await fetch(`https://api.sunrisesunset.io/json?lat=38.907192&lng=-77.036873&date_start=${getYear(date)}-${getMonth(date) + 1}-01&date_end=${getYear(date)}-${getMonth(date) + 2}-01&time_format=24`);
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

    useEffect(() => { chercherSoleil() }, [])
    
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
        console.log(cielNoirTableau);
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

    return (
        <Wrapper>
            <thead>
                <tr>
                    <th>{format(date, "MMMM", { locale: fr })}</th>
                    <th>Début</th>
                    <th></th>
                    <th>Lune</th>
                    <th></th>
                    <th>Fin</th>
                </tr>
            </thead>
            <tbody>
                {
                    donneesSoleil !== undefined && donneesLune !== undefined && tousJours.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item}</td>
                                <td>{donneesSoleil[index].last_light.slice(0,5).replace(":", " h ")}</td>
                                <td>
                                    {
                                        cielNoir && cielNoir.length && cielNoir[index].luneBye && <span>{cielNoir[index].luneBye.replace(":", " h ")}</span>
                                    }
                                </td>
                                <td>
                                    {
                                        (donneesLune[index].fracillum >= "50 %" || donneesLune[index].fracillum === "100%") && donneesLune[index].fracillum.length > 2 ? <span>{donneesLune[index].fracillum}</span> : <span>{donneesLune[index].fracillum}</span>
                                    }
                                </td>
                                <td>
                                    {
                                        cielNoir && cielNoir.length && cielNoir[index].luneAllo && <span>{cielNoir[index].luneAllo.replace(":", " h ")}</span>
                                    }
                                </td>
                                <td>{donneesSoleil[index + 1].first_light.slice(0,5).replace(":", " h ")}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Wrapper>
    )
}

const Wrapper = styled.table`
    border: 1px solid var(--c0);
    td {
        border: 1px dashed var(--c0);
        padding: 5px;
    }
`

export default Mois;