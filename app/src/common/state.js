import fs from 'fs';
import path from 'path';
import firstBy from 'thenby';
import { remote, ipcRenderer } from 'electron';
import { Container } from 'unstated';
import debounce from 'lodash.debounce';
import formatPath from '~/common/format-path';
import store from '~/common/store';
import Channel from '~/common/channels';

const FAILED_DEBOUNCE_WAIT = 250;

class AppState extends Container {
  state = {
    projects: [],
    selected: null,
    failed: [],
    scripts: {},
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
    // Load added projects
    ipcRenderer.send(Channel.PROJECTS_LOAD);
  }

  // Settings
  syncSettings() {
    store.set('projects', this.state.projects.map(project => project.path));
  }

  clearSettings() {
    this.setState({ projects: [] });
    store.clear();
  }

  editSettings() {
    store.openInEditor();
  }

  getTerminalApp() {
    return this.state.terminal;
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

  refreshProjects() {
    this.state.projects.forEach(project => {
      ipcRenderer.send(Channel.PROJECT_OPEN_REQUEST, project.path);
    });
  }

  setSelected(project) {
    this.setState({ selected: project });
  }

  getSelected(code) {
    return this.state.selected;
  }

  proceedValidProject(newProject) {
    // Check if project already exist in list
    const existingProject = this.state.projects.find(
      project => project.path === newProject.path
    );
    // Replace old project with a new data, or append it if new one
    this.setState({
      projects: existingProject
        ? this.state.projects.map(
            project => (project === existingProject ? newProject : project)
          )
        : [...this.state.projects, newProject],
    });
    // Save settings
    this.syncSettings();
  }

  // Since adding projects is async, we need to make sure send notification once
  notifyAboutFailedProjects = debounce(() => {
    const failedCount = this.state.failed.length;
    const message =
      failedCount > 1
        ? `Failed to load ${failedCount} projects.`
        : `Failed to load project. Make sure ${formatPath(
            this.state.failed[0]
          )} is a valid npm module.`;
    ipcRenderer.send(Channel.NOTIFICATION_SHOW, { body: message });
    this.setState({ failed: [] });
  }, FAILED_DEBOUNCE_WAIT);

  proceedInvalidProject(reason) {
    this.setState({ failed: [...this.state.failed, reason.path] });
    this.notifyAboutFailedProjects();
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
