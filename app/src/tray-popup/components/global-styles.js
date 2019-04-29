import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-font-smoothing: antialiased;
    font-smooth: always;
    font-size: 14px;
    cursor: default;
    user-select: none;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
    padding: 0;
    margin: 0;
  }

  #root {
    width: 100vw;
    height: calc(100vh - 17px);
  }
`;

export default GlobalStyles;
