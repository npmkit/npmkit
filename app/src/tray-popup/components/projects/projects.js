import styled from 'styled-components';
import { Subscribe } from 'unstated';
import AppState from '~/common/state';
import Project from './project';
import Placeholder from './placeholder';

const ProjectsContainer = styled.div`
  overflow-y: scroll;
  flex: 1;
`;

const Projects = props => (
  <Subscribe to={[AppState]}>
    {app =>
      app.hasAnyProjects() ? (
        <ProjectsContainer>
          {app
            .getFilteredProjects()
            .map(project => (
              <Project
                onFocus={() => app.setSelected(project)}
                key={project.code}
                project={project}
                selected={app.getSelected() === project}
              />
            ))}
        </ProjectsContainer>
      ) : (
        <Placeholder>Add new project by dragging it here</Placeholder>
      )
    }
  </Subscribe>
);

export default Projects;
