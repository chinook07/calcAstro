import GlobalStyles from "./GlobalStyles";
import Localiser from "./composantes/Localiser";

const App = () => {
    return (
        
        <>
            <GlobalStyles />
            <h1>CalcAstro</h1>
            <p>Calculer l'heure optimale pour l'observation des étoiles</p>
            <Localiser />
            <p>App</p>
        </>
    );
}

export default App;
