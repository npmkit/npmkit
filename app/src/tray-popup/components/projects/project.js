import { remote, shell, clipboard, ipcRenderer } from 'electron';
import styled, { css, keyframes } from 'styled-components';
import { tint } from 'polished';
import { Subscribe } from 'unstated';
import plugins from '~/plugins';
import AppContainer from '~/common/app-container';
import ScriptsContainer from '~/common/scripts-container';
import Channels from '~/common/channels';
import formatPath from '~/common/format-path';
import extractInitials from '~/common/extract-initials';

const cropOverflowedText = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const opacityAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const ProjectView = styled.button.attrs({ tabIndex: '0' })`
  transition: opacity 100ms ease;
  padding: 0.5rem 0.75rem;
  background-color: transparent;
  align-items: center;
  text-align: left;
  display: flex;
  width: 100%;
  border: none;
  border-radius: 4px;
  font: inherit;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px white,
      inset 0 0 0 4px ${props => props.theme.colors.primary};
  }

  &:not(:focus):hover {
    opacity: 0.8;
  }
`;

const Avatar = styled.div.attrs({ role: 'presentation' })`
  width: 30px;
  height: 30px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-weight: 100;
  border-radius: 50%;
  position: relative;
  background: linear-gradient(
    0.45turn,
    ${props => props.accent},
    ${props => tint(0.5, props.accent)}
  );
`;

const Star = styled.div.attrs({ children: '⭐️' })`
  position: absolute;
  font-size: 1.2rem;
  left: -0.5rem;
  top: -0.5rem;
`;

const Details = styled.div`
  padding-left: 0.5rem;
  flex-direction: column;
  display: flex;
  min-width: 0;
  flex: 1;
`;

const Name = styled.h3`
  ${cropOverflowedText};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-weight: normal;
  font-size: 1rem;
`;

const Path = styled.div`
  ${cropOverflowedText};
  font-size: 0.75rem;
  color: #999;
`;

const Status = styled.div`
  color: ${props => props.theme.colors.primary};
  margin-left: 0.25rem;
  align-items: center;
  align-items: center;
  font-weight: bold;
  display: flex;
  font-size: 0.85rem;
`;

const StatusBall = styled.span`
  background-color: ${props => props.theme.colors.primary};
  animation: ${opacityAnimation} 1s linear infinite;
  margin-right: 0.25rem;
  display: inline-block;
  border-radius: 50%;
  width: 6px;
  height: 6px;
`;

const getMenuPosition = event => {
  const mouse = { x: event.clientX, y: event.clientY };
  const rect = document.activeElement.getBoundingClientRect();
  const element = {
    x: parseInt(rect.right - rect.width / 2),
    y: parseInt(rect.top),
  };
  return { x: mouse.x || element.x, y: mouse.y || element.y };
};

const showProjectMenu = (app, scripts, project, position = {}) => {
  const scriptsMenu = Object.entries(project.scripts).map(([script]) => ({
    label: scripts.isRunning(project, script) ? `▪️ stop ${script}` : script,
    click: () =>
      scripts.isRunning(project, script)
        ? scripts.stop(project, script)
        : scripts.run(project, script),
  }));
  const pluginsMenu = plugins
    .hooks('getProjectMenu')
    .map(getProjectMenu => getProjectMenu({ app, scripts, project }));
  // Show menu
  remote.Menu.buildFromTemplate(
    [
      {
        label: project.name,
        enabled: false,
      },
      {
        label: 'Pin on Top',
        type: 'checkbox',
        checked: project.pinned,
        click: () => (project.pinned ? app.unpin(project) : app.pin(project)),
      },
      { type: 'separator' },
      {
        label: 'Open in Terminal',
        click: () => ipcRenderer.send(Channels.TERMINAL_OPEN, project.path),
      },
      {
        label: 'Open in Editor',
        click: () => ipcRenderer.send(Channels.EDITOR_OPEN, project.path),
      },
      {
        label: 'Reveal in Finder',
        click: () => shell.showItemInFolder(project.path),
      },
      { type: 'separator' },
      pluginsMenu.length && {
        label: 'Plugins',
        submenu: pluginsMenu,
      },
      scriptsMenu.length && {
        label: 'Scripts',
        submenu: scriptsMenu,
      },
      {
        label: 'Copy Path',
        click: () => clipboard.writeText(project.path),
      },
      {
        label: 'Copy Name',
        click: () => clipboard.writeText(project.name),
      },
      { type: 'separator' },
      {
        label: 'Remove from List',
        click: () => app.removeProject(project),
      },
    ].filter(Boolean)
  ).popup(position);
};

const renderScriptsStatus = (scripts, project) => {
  const runningScripts = scripts.getRunning(project);
  const runningScriptsCount = runningScripts.length;
  return runningScriptsCount ? (
    <Status>
      <StatusBall />{' '}
      {runningScriptsCount === 1
        ? `${runningScripts[0].name} is running`
        : `${runningScriptsCount} scripts are running`}
    </Status>
  ) : null;
};

const Project = ({ project, ...props }) => (
  <Subscribe to={[AppContainer, ScriptsContainer]}>
    {(app, scripts) => (
      <ProjectView
        {...props}
        innerRef={node => node && props.selected && node.focus()}
        onContextMenu={() => showProjectMenu(app, scripts, project)}
        onClick={event =>
          showProjectMenu(app, scripts, project, getMenuPosition(event))
        }
      >
        <Avatar accent={project.color}>
          {project.pinned && <Star />}
          {extractInitials(project.name)}
        </Avatar>
        <Details>
          <Name title={project.name}>{project.name}</Name>
          <Path title={project.path}>{formatPath(project.path)}</Path>
        </Details>
        {renderScriptsStatus(scripts, project)}
      </ProjectView>
    )}
  </Subscribe>
);

export default Project;
