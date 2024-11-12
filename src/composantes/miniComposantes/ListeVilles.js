import styled from "styled-components";

const ABCDEF = () => {
    return (
        <Wrapper>
            <select>
                <option value="45.504969985573595,-73.59757899599053">Montréal</option>
                <option value="46.81469340530121,-71.2422551902899">Québec</option>
                <option value="45.556539566711365,-73.73870862167698">Laval</option>
                <option value="45.43618917073249,-75.71533465574977">Gatineau</option>
                <option value="45.5211130308728,-73.48182419189227">Longueuil</option>
                <option value="45.40061462170609,-71.88836594314911">Sherbrooke</option>
                <option value="46.811635667199134,-71.17462883180849">Lévis</option>
                <option value="48.42834717258922,-71.0658154186431">Saguenay</option>
                <option value="46.34658091772328,-72.54226232279217">Trois-Rivières</option>
            </select>
        </Wrapper>
    )
}

const Wrapper = styled.form``

export default ABCDEF;