import { createContext, useState, useEffect } from "react";

export const AstroContexte = createContext();

const AstroContexteProvider = ({ children }) => {

    const [emplacement, setEmplacement] = useState();
    const [date, setDate] = useState();
    const [pret, setPret] = useState(false);

    useEffect(() => {
        setDate(new Date());
        setPret(true);
    }, [])
    
    
    return (
        <AstroContexte.Provider
            value={{
                emplacement, setEmplacement, date, setDate, pret
            }}
        >{children}</AstroContexte.Provider>
    )
}

export default AstroContexteProvider;