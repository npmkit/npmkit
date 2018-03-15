import { remote, shell, clipboard } from 'electron';
import styled, { css } from 'styled-components';
import Button from '~/common/components/button';

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

const showOptions = project => {
  Menu.buildFromTemplate([
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

const Project = props => (
  <Container>
    <Avatar style={{ backgroundColor: props.color }}>{props.name[0]}</Avatar>
    <Details>
      <Name title={props.name}>{props.name}</Name>
      <Path title={props.path}>{props.path.replace(userHomePath, '~')}</Path>
    </Details>
    <Actions>
      <Action onClick={() => showOptions(props)}>🛠</Action>
    </Actions>
  </Container>
);

export default Project;
