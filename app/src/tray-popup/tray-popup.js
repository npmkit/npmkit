import React from 'react';
import { remote } from 'electron';
import { injectGlobal } from 'styled-components';
import { Provider, Subscribe } from 'unstated';
import { hot } from 'react-hot-loader';
import preferences from '~/common/preferences-store';
import Button from '~/common/components/button';
import AppContainer from '~/common/app-container';
import KeyCodes from '~/common/key-codes';
import Tray from './components/tray';
import Toolbar from './components/toolbar';
import Projects from './components/projects';

injectGlobal`
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

const { Menu, MenuItem } = remote;
const showOptions = app => {
  Menu.buildFromTemplate([
    {
      label: 'Refresh projects',
      accelerator: 'Cmd+Alt+R',
      click: () => app.refreshProjects(),
    },
    { type: 'separator' },
    { label: 'Edit settings', click: () => app.editSettings() },
    { label: 'Clear settings', click: () => app.clearSettings() },
    { type: 'separator' },
    { label: 'About npmkit', role: 'about', click: () => {} },
    {
      label: 'Quit npmkit',
      role: 'quit',
      accelerator: 'Cmd+Q',
      click: () => remote.app.quit(),
    },
  ]).popup();
};

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
  const renderedProjects = app.getFilteredProjects();
  const selectedProjectIndex = renderedProjects.indexOf(app.getSelected());
  switch (event.which) {
    case KeyCodes.ARROW_UP:
      const prevIndex = Math.max(0, selectedProjectIndex - 1);
      app.setSelected(renderedProjects[prevIndex]);
      break;
    case KeyCodes.ARROW_DOWN:
      const nextIndex = Math.min(
        renderedProjects.length - 1,
        selectedProjectIndex + 1
      );
      app.setSelected(renderedProjects[nextIndex]);
      break;
    case KeyCodes.ESC:
      app.clearSearch();
    default:
      break;
  }
};

const App = () => (
  <Provider>
    <Subscribe to={[AppContainer]}>
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
                <Toolbar.Action onClick={() => showOptions(app)}>
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
