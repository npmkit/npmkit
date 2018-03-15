import React from 'react';
import { remote } from 'electron';
import { injectGlobal } from 'styled-components';
import { Provider, Subscribe } from 'unstated';
import { hot } from 'react-hot-loader';
import store from '~/common/store';
import AppState from '~/common/state';
import Tray from './components/tray';
import Toolbar from './components/toolbar';
import Projects from './components/projects';

const { Menu, MenuItem } = remote;
const optionsMenu = Menu.buildFromTemplate([
  { label: 'About npmkit' },
  { label: 'Clear settings', click: () => store.clear() },
  { type: 'separator' },
  {
    label: 'Quit npmkit',
    accelerator: 'Cmd+Q',
    click: () => remote.app.quit(),
  },
]);

injectGlobal`
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
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

const App = () => (
  <Provider>
    <Subscribe to={[AppState]}>
      {app => (
        <Tray
          onDragEnter={() => app.fileDragEnter()}
          onDragLeave={() => app.fileDragLeave()}
          onDrop={event => app.fileDrop(event.dataTransfer.files)}
        >
          <Tray.Arrow />
          <Tray.Popup>
            <Toolbar>
              <Toolbar.Action>🔍</Toolbar.Action>
              <Toolbar.Title>npmkit</Toolbar.Title>
              <Toolbar.Action onClick={() => optionsMenu.popup()}>
                ⚙️
              </Toolbar.Action>
            </Toolbar>
            <Projects />
          </Tray.Popup>
        </Tray>
      )}
    </Subscribe>
  </Provider>
);

export default hot(module)(App);
