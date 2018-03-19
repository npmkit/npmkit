import styled from 'styled-components';
import { Subscribe } from 'unstated';
import AppContainer from '~/common/app-container';
import Project from './project';
import Note from './note';
import ContentPlaceholder from './content-placeholder';

const View = styled.div`
  overflow-y: scroll;
  flex: 1;
`;

const Projects = props => (
  <Subscribe to={[AppContainer]}>
    {app => (
      <View>
        {app.hasLoadedProjects() ? (
          app.hasAnyProjects() ? (
            app
              .getFilteredProjects()
              .map(project => (
                <Project
                  onFocus={() => app.setSelected(project)}
                  key={project.code}
                  project={project}
                  selected={app.getSelected() === project}
                />
              ))
          ) : (
            <Note>Add new projects by dragging it here 🗄</Note>
          )
        ) : (
          <ContentPlaceholder />
        )}
      </View>
    )}
  </Subscribe>
);

export default Projects;
