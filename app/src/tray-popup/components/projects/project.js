import path from 'path';
import { remote, shell, clipboard, ipcRenderer } from 'electron';
import styled, { css } from 'styled-components';
import Button from '~/common/components/button';
import Channels from '~/common/channels';

const { Menu, MenuItem } = remote;
const userHomePath = remote.app.getPath('home');

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

const fetchScripts = project => {
  // tbd
};

const showProjectMenu = project => {
  Menu.buildFromTemplate([
    {
      label: 'Scripts',
      submenu: [],
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
      <Path title={project.path}>
        {project.path.replace(userHomePath, '~')}
      </Path>
    </Details>
    <Actions>
      <Action onClick={() => showProjectMenu(project)}>🛠</Action>
    </Actions>
  </Container>
);

export default Project;
