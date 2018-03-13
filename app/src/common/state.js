import fs from 'fs';
import path from 'path';
import firstBy from 'thenby';
import { ipcRenderer } from 'electron';
import { Container } from 'unstated';
import store from '~/common/store';
import { notify } from '~/common/notifications';
import Channel from '~/common/channels';

class AppState extends Container {
  state = {
    projects: store.get('projects', []),
    projectsFilter: null,
  };

  constructor(...args) {
    super(...args);
    // Subscribe to main process replies
    ipcRenderer.on(Channel.PROJECT_OPEN_SUCCESS, (_, payload) =>
      this.proceedValidProject(payload)
    );
    ipcRenderer.on(Channel.PROJECT_OPEN_ERROR, (_, payload) =>
      this.proceedInvalidProject(payload)
    );
  }

  // Projects related
  hasAnyProjects() {
    return this.state.projects.length > 0;
  }

  getAllProjects() {
    return this.state.projects.sort(
      firstBy('name', { ignoreCase: true }).thenBy('path')
    );
  }

  getFilteredProjects() {
    const projects = this.getAllProjects();
    if (this.state.filter && this.state.filter.trim()) {
      return projects.filter(project =>
        project.name.includes(this.state.filter)
      );
    }
    return projects;
  }

  proceedValidProject(project) {
    const nextProjects = [...this.state.projects, project];
    this.setState({ projects: nextProjects });
    store.set('projects', nextProjects);
  }

  proceedInvalidProject(reason) {
    // tbd: notify
  }

  // Drag and drop related
  fileDragEnter() {
    this.setState({ entered: true });
  }

  fileDragLeave() {
    this.setState({ entered: false });
  }

  fileDrop(files) {
    Array.from(files).forEach(file =>
      ipcRenderer.send(Channel.PROJECT_OPEN_REQUEST, file.path)
    );
  }
}

export default AppState;
