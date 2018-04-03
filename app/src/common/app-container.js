import firstBy from 'thenby';
import { ipcRenderer } from 'electron';
import { Container } from 'unstated';
import debounce from 'lodash.debounce';
import formatPath from '~/common/format-path';
import createStore from '~/common/preferences-store';
import Channels from '~/common/channels';

const FAILED_DEBOUNCE_WAIT = 250;

/**
 * This state container keeps key info about projects
 */
export default class AppState extends Container {
  state = {
    ready: false,
    projects: [],
    selected: null,
    search: null,
    failed: [],
  };

  searchInputRef = null;

  preferences = createStore();

  constructor(...args) {
    super(...args);
    // Subscribe to main process replies
    ipcRenderer.on(Channels.PROJECT_OPEN_SUCCESS, (_, payload) =>
      this.proceedValidProject(payload)
    );
    ipcRenderer.on(Channels.PROJECT_OPEN_ERROR, (_, payload) =>
      this.proceedInvalidProject(payload)
    );
    ipcRenderer.on(Channels.PROJECTS_LOADED, () => {
      this.setState({ ready: true });
    });
    // Load added projects
    ipcRenderer.send(Channels.PROJECTS_LOAD);
  }

  // Preferences
  syncPreferences() {
    this.preferences.set(
      'projects',
      this.state.projects.map(project => project.path)
    );
    this.preferences.set(
      'pinned',
      this.state.projects
        .filter(project => project.pinned)
        .map(project => project.path)
    );
  }

  clearPreferences() {
    this.setState({ projects: [], pinned: [] });
    this.preferences.clear();
  }

  editPreferences() {
    this.preferences.openInEditor();
  }

  getTerminalApp() {
    return this.state.terminal;
  }

  // Projects related
  hasLoadedProjects() {
    return this.state.ready;
  }

  hasAnyProjects() {
    return this.state.projects.length > 0;
  }

  getSortedProjects() {
    return this.state.projects.sort(
      firstBy('pinned', { direction: -1 })
        .thenBy('name', { ignoreCase: true })
        .thenBy('path')
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
      ipcRenderer.send(Channels.PROJECT_OPEN_REQUEST, project.path);
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
    this.syncPreferences();
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
    ipcRenderer.send(Channels.NOTIFICATION_SHOW, { body: message });
    this.setState({ failed: [] });
  }, FAILED_DEBOUNCE_WAIT);

  proceedInvalidProject(reason) {
    this.setState({ failed: [...this.state.failed, reason.path] });
    this.notifyAboutFailedProjects();
  }

  setPinned(project, value) {
    this.setState({
      projects: this.state.projects.map(
        current =>
          current === project ? { ...current, pinned: value } : current
      ),
    });
    this.syncPreferences();
  }

  pin(project) {
    this.setPinned(project, true);
  }

  unpin(project) {
    this.setPinned(project, false);
  }

  removeProject(project) {
    this.setState({
      projects: this.state.projects.filter(current => current !== project),
    });
    this.syncPreferences();
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
    this.setSelected(null);
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
      ipcRenderer.send(Channels.PROJECT_OPEN_REQUEST, file.path)
    );
  }

  checkForUpdates() {
    ipcRenderer.send(Channels.CHECK_FOR_UPDATE);
  }
}
