import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import TrayPopup from '~/tray-popup';
import theme from '~/common/theme';

render(
  <ThemeProvider theme={theme}>
    <TrayPopup />
  </ThemeProvider>,
  document.getElementById('root')
);
