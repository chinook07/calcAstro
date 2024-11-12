import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ABCDEF = () => {
    return (
        <Wrapper>
            <fieldset>
                <input type="number" max="90" min="-90"></input>
                <input type="number" max="180" min="-180"></input>
            </fieldset>
        </Wrapper>
    )
}

const Wrapper = styled.form``

export default ABCDEF;