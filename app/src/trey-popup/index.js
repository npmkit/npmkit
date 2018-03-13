import React from 'react';
import { remote } from 'electron';
import { injectGlobal } from 'styled-components';
import { Provider, Subscribe } from 'unstated';
import { hot } from 'react-hot-loader';
import store from '~/common/store';
import AppState from '~/common/state';
import Trey from './components/trey';
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
  }

  body {
    padding: 0;
    margin: 0;
    margin-top: 6px;
  }

  #root {
    flex-direction: column;
    justify-content: flex-start;
    display: flex;
    width: calc(100vw - 11px);
    height: calc(100vh - 11px);
  }
`;

const App = () => (
  <Provider>
    <Subscribe to={[AppState]}>
      {app => (
        <Trey
          onDragEnter={() => app.fileDragEnter()}
          onDragLeave={() => app.fileDragLeave()}
          onDrop={event => app.fileDrop(event.dataTransfer.files)}
        >
          <Trey.Arrow />
          <Trey.Popup>
            <Toolbar>
              <Toolbar.Action>🔍</Toolbar.Action>
              <Toolbar.Title>npmkit</Toolbar.Title>
              <Toolbar.Action onClick={() => optionsMenu.popup()}>
                ⚙️
              </Toolbar.Action>
            </Toolbar>
            <Projects />
          </Trey.Popup>
        </Trey>
      )}
    </Subscribe>
  </Provider>
);

export default hot(module)(App);
