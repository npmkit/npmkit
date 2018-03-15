import React from 'react';
import { remote } from 'electron';
import { injectGlobal } from 'styled-components';
import { Provider, Subscribe } from 'unstated';
import { hot } from 'react-hot-loader';
import store from '~/common/store';
import Button from '~/common/components/button';
import AppState from '~/common/state';
import KeyCodes from '~/common/key-codes';
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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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

const handlePrintableKeyPress = app => event => {
  // Enable search panel once printable character is hit
  switch (event.which) {
    case KeyCodes.ENTER:
      break;
    default:
      app.setSearch(event.target.value || '');
      break;
  }
};

const handleMetaKeyPress = app => event => {
  // Clear search once esc is hit
  switch (event.which) {
    case KeyCodes.ESC:
      app.clearSearch();
    default:
      break;
  }
};

const App = () => (
  <Provider>
    <Subscribe to={[AppState]}>
      {app => (
        <Tray
          onDragEnter={() => app.fileDragEnter()}
          onDragLeave={() => app.fileDragLeave()}
          onDrop={event => app.fileDrop(event.dataTransfer.files)}
          onKeyPress={handlePrintableKeyPress(app)}
          onKeyDown={handleMetaKeyPress(app)}
        >
          <Tray.Arrow />
          <Tray.Popup>
            {app.hasSearch() ? (
              <Toolbar>
                <Toolbar.Search
                  innerRef={node => app.setSearchInputRef(node)}
                  placeholder="Search projects"
                  onChange={event => app.setSearch(event.target.value)}
                  value={app.getSearch()}
                  autoFocus
                />
                <Button onClick={() => app.clearSearch()} ghost>
                  🗑
                </Button>
              </Toolbar>
            ) : (
              <Toolbar>
                <Toolbar.Action onClick={() => app.setSearch('')}>
                  🔍
                </Toolbar.Action>
                <Toolbar.Title>npmkit</Toolbar.Title>
                <Toolbar.Action onClick={() => optionsMenu.popup()}>
                  ⚙️
                </Toolbar.Action>
              </Toolbar>
            )}
            <Projects />
          </Tray.Popup>
        </Tray>
      )}
    </Subscribe>
  </Provider>
);

export default hot(module)(App);
