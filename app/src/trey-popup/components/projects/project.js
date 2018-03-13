import { remote } from 'electron';
import styled, { css } from 'styled-components';

const userHomePath = remote.app.getPath('home');

const cropOverflowedText = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Container = styled.div`
  padding: 0.5rem;
  display: flex;
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

const Project = ({ name, path, client, color, code }) => (
  <Container>
    <Avatar style={{ backgroundColor: color }}>{name[0]}</Avatar>
    <Details>
      <Name title={name}>{name}</Name>
      <Path title={path}>{path.replace(userHomePath, '~')}</Path>
    </Details>
  </Container>
);

export default Project;
