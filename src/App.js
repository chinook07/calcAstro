import GlobalStyles from "./GlobalStyles";
import Localiser from "./composantes/Localiser";
import DateAuj from "./composantes/DateAuj";

const App = () => {
    return (
        
        <>
            <GlobalStyles />
            <h1>CalcAstro</h1>
            <p>Calculer l'heure optimale pour l'observation des étoiles</p>
            <Localiser />
            <DateAuj />
        </>
    );
}

export default App;
