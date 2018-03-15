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
    search: null,
  };

  searchInputRef = null;

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

  syncStore() {
    store.set('projects', this.state.projects);
  }

  // Projects related
  hasAnyProjects() {
    return this.state.projects.length > 0;
  }

  getSortedProjects() {
    return this.state.projects.sort(
      firstBy('name', { ignoreCase: true }).thenBy('path')
    );
  }

  getFilteredProjects() {
    const projects = this.getSortedProjects();
    const search = this.state.search && this.state.search.trim().toLowerCase();
    return search
      ? projects.filter(project => project.name.includes(search))
      : projects;
  }

  proceedValidProject(project) {
    // Exit if project already added
    if (this.state.projects.some(current => current.path === project.path)) {
      return;
    }
    this.setState({ projects: [...this.state.projects, project] });
    this.syncStore();
  }

  proceedInvalidProject(reason) {
    // tbd: notify
  }

  // Project search related
  setSearchInputRef(node) {
    this.searchInputRef = node;
  }

  getSearch() {
    return this.state.search;
  }

  hasSearch() {
    return typeof this.getSearch() === 'string';
  }

  setSearch(keyword) {
    this.setState({ search: keyword });
    if (this.searchInputRef) {
      this.searchInputRef.focus();
    }
  }

  clearSearch() {
    this.setState({ search: null });
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
