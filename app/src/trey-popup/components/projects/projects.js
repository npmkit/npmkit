import styled from 'styled-components';
import { Subscribe } from 'unstated';
import AppState from '~/common/state';
import Project from './project';
import Placeholder from './placeholder';

const Projects = props => (
  <Subscribe to={[AppState]}>
    {app =>
      app.hasAnyProjects() ? (
        <div>
          {app
            .getFilteredProjects()
            .map(project => <Project key={project.code} {...project} />)}
        </div>
      ) : (
        <Placeholder>Add new project by dragging it here</Placeholder>
      )
    }
  </Subscribe>
);

export default Projects;
