import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    * {
        box-sizing: border-box;
        color: var(--c2);
    }
    html {
        background-color: var(--c0);

    }
    body {
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        margin: 10px;
    }
    button,
    input,
    select {
        background-color: var(--c1);
        border-radius: 5px;
        padding: 5px;
    }
    :root {
        --c0: #000;
        --c1: #0A1D33;
        --c2: #C5FFFD;
        --c3: #88D9E6;
        --c4: #0e3b10;
        --c5: #E2C044;
    }
`