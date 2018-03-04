import { injectGlobal } from 'styled-components';
import TreyArrow from '~/components/trey-arrow';
import TreyPopup from '~/components/trey-popup';

injectGlobal`
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 16px;
    cursor: default;
  }

  body {
    padding: 0;
    margin: 0;
    margin-top: 0.3rem;
  }
`;

const App = () => (
  <React.Fragment>
    <TreyArrow />
    <TreyPopup>npmkit</TreyPopup>
  </React.Fragment>
);

export default App;
