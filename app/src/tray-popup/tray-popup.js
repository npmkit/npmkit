import React from 'react';
import { remote } from 'electron';
import { Provider, Subscribe } from 'unstated';
import { hot } from 'react-hot-loader';
import Icon from '~/common/components/icon';
import AppContainer from '~/common/app-container';
import KeyCodes from '~/common/key-codes';
import Tray from './components/tray';
import Toolbar from './components/toolbar';
import Projects from './components/projects';
import GlobalStyles from './components/global-styles';

const { Menu } = remote;
const showOptions = app => {
  Menu.buildFromTemplate([
    {
      label: 'Reload Preferences',
      click: () => app.refreshPreferences(),
    },
    { type: 'separator' },
    { label: 'Edit Preferences', click: () => app.editPreferences() },
    { label: 'Reset Preferences', click: () => app.resetPreferences() },
    { type: 'separator' },
    { label: 'About npmkit', role: 'about', click: () => {} },
    {
      label: 'Quit npmkit',
      role: 'quit',
      accelerator: 'Cmd+Q',
      click: () => remote.app.quit(),
    },
  ]).popup({});
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
          <GlobalStyles />
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
                <Toolbar.Action onClick={() => app.clearSearch()}>
                  <Icon glyph="clear" />
                </Toolbar.Action>
              </Toolbar>
            ) : (
              <Toolbar>
                <Toolbar.Action onClick={() => app.setSearch('')}>
                  <Icon glyph="magnifier" />
                </Toolbar.Action>
                <Toolbar.Title>npmkit</Toolbar.Title>
                <Toolbar.Action onClick={() => showOptions(app)}>
                  <Icon glyph="gear" />
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
