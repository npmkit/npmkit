import path from 'path';
import { remote, shell, clipboard, ipcRenderer } from 'electron';
import styled, { css, keyframes } from 'styled-components';
import { Subscribe } from 'unstated';
import ScriptsContainer from '~/common/scripts-container';
import Button from '~/common/components/button';
import Channels from '~/common/channels';
import formatPath from '~/common/format-path';

const cropOverflowedText = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const opacityPulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const Container = styled.button`
  padding: 0.5rem 0.75rem;
  background: transparent;
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
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-weight: 100;
  border-radius: 50%;
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
  animation: ${opacityPulse} 1s linear infinite;
  background: ${props => props.theme.colors.primary};
  margin-right: 0.25rem;
  display: inline-block;
  border-radius: 50%;
  width: 6px;
  height: 6px;
`;

const showProjectMenu = (scripts, project) => {
  const scriptsMenu = Object.entries(project.scripts).map(
    ([script, command]) => ({
      label: scripts.isRunning(project, script)
        ? `Stop ${script} (running)`
        : script,
      click: () =>
        scripts.isRunning(project, script)
          ? scripts.stop(project, script)
          : scripts.run(project, script),
    })
  );
  // Show menu
  remote.Menu.buildFromTemplate(
    [
      {
        label: project.name,
        enabled: false,
      },
      { type: 'separator' },
      scriptsMenu.length && {
        label: 'Scripts',
        submenu: scriptsMenu,
      },
      {
        label: 'Open in Terminal',
        click: () =>
          ipcRenderer.send(Channels.TERMINAL_OPEN, { cwd: project.path }),
      },
      {
        label: 'Open in Editor',
        click: () => shell.openItem(path.join(project.path, 'package.json')),
      },
      { type: 'separator' },
      {
        label: 'Reveal in Finder',
        click: () => shell.showItemInFolder(project.path),
      },
      {
        label: 'Copy Path',
        click: () => clipboard.writeText(project.path),
      },
    ].filter(Boolean)
  ).popup();
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
  <Subscribe to={[ScriptsContainer]}>
    {scripts => (
      <Container
        {...props}
        tabIndex="0"
        innerRef={node => node && props.selected && node.focus()}
        onContextMenu={() => showProjectMenu(scripts, project)}
        onClick={() => showProjectMenu(scripts, project)}
      >
        <Avatar style={{ backgroundColor: project.color }}>
          {project.name[0]}
        </Avatar>
        <Details>
          <Name title={project.name}>{project.name}</Name>
          <Path title={project.path}>{formatPath(project.path)}</Path>
        </Details>
        {renderScriptsStatus(scripts, project)}
      </Container>
    )}
  </Subscribe>
);

export default Project;
