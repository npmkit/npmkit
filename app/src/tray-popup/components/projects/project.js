import path from 'path';
import { remote, shell, clipboard, ipcRenderer } from 'electron';
import styled, { css } from 'styled-components';
import Button from '~/common/components/button';
import Channels from '~/common/channels';
import formatPath from '~/common/format-path';

const cropOverflowedText = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Actions = styled.div`
  visibility: hidden;
`;

const Action = styled(Button).attrs({ ghost: true })`
  font-size: 1.25rem;
`;

const Container = styled.div`
  padding: 0.5rem 0.75rem;
  display: flex;

  &:hover {
    ${Actions} {
      visibility: visible;
    }
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

const showProjectMenu = project => {
  remote.Menu.buildFromTemplate([
    {
      label: 'Scripts',
      submenu: Object.entries(project.scripts).map(([script, command]) => {
        // Check if script is running
        const isRunning =
          ipcRenderer.sendSync(Channels.SCRIPT_STATUS_SYNC, {
            project,
            script,
          }) === 'running';
        return {
          label: isRunning ? `Stop ${script} (running)` : script,
          sublabel: command,
          enabled: true,
          click: () =>
            // Stop process if running or start one
            ipcRenderer.send(
              isRunning ? Channels.SCRIPT_STOP : Channels.SCRIPT_START,
              { project, script }
            ),
        };
      }),
    },
    { type: 'separator' },
    {
      label: 'Open in Terminal',
      click: () => ipcRenderer.send(Channels.TERMINAL_OPEN, project.path),
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
  ]).popup();
};

const Project = ({ project }) => (
  <Container>
    <Avatar style={{ backgroundColor: project.color }}>
      {project.name[0]}
    </Avatar>
    <Details>
      <Name title={project.name}>{project.name}</Name>
      <Path title={project.path}>{formatPath(project.path)}</Path>
    </Details>
    <Actions>
      <Action onClick={() => showProjectMenu(project)}>🛠</Action>
    </Actions>
  </Container>
);

export default Project;
