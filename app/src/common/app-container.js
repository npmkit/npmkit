import firstBy from 'thenby';
import { ipcRenderer } from 'electron';
import { Container } from 'unstated';
import debounce from 'lodash.debounce';
import Fuse from 'fuse.js';
import formatPath from '~/common/format-path';
import createStore from '~/common/preferences-store';
import Channels from '~/common/channels';

const FAILED_DEBOUNCE_WAIT = 500;
const DEFAULT_STATE = {
  ready: false,
  projects: [],
  selected: null,
  search: null,
  failed: [],
};
// Custom sort function for unfiltered projects
const sortFn = firstBy('pinned', { direction: -1 })
  .thenBy('name', { ignoreCase: true })
  .thenBy('path');

// This state container keeps key info about projects
export default class AppState extends Container {
  state = DEFAULT_STATE;

  searchInputRef = null;

  preferences = createStore();

  constructor(...args) {
    super(...args);
    // Auto sync state changes with preferences
    this.subscribe(() => this.syncPreferences());
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

  resetPreferences() {
    this.preferences.clear();
    this.preferences.ensureDefaults();
    this.setState({ ...DEFAULT_STATE, ready: true });
  }

  editPreferences() {
    this.preferences.openInEditor();
  }

  getTerminalApp() {
    return this.state.terminal;
  }

  isReady() {
    return this.state.ready;
  }

  hasProjects() {
    return this.state.projects.length > 0;
  }

  getFilteredProjects() {
    const { search, projects } = this.state;
    return search
      ? new Fuse(projects, { keys: ['name', 'path'] }).search(search)
      : projects.sort(sortFn);
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
      p => p.path === newProject.path
    );
    // Replace old project with a new data, or append it if new one
    this.setState({
      projects: existingProject
        ? this.state.projects.map(p => (p === existingProject ? newProject : p))
        : [...this.state.projects, newProject],
    });
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
    const nextProjects = this.state.projects.filter(
      p => !this.state.failed.includes(p.path)
    );
    this.setState({ failed: [], projects: nextProjects });
    ipcRenderer.send(Channels.NOTIFICATION_SHOW, { body: message });
  }, FAILED_DEBOUNCE_WAIT);

  proceedInvalidProject(project) {
    this.setState(
      { failed: [...this.state.failed, project.path] },
      this.notifyAboutFailedProjects
    );
  }

  setPinned(project, value) {
    this.setState({
      projects: this.state.projects.map(
        p => (p === project ? { ...p, pinned: value } : p)
      ),
    });
  }

  pin(project) {
    this.setPinned(project, true);
  }

  unpin(project) {
    this.setPinned(project, false);
  }

  removeProject(project) {
    this.setState({
      projects: this.state.projects.filter(p => p !== project),
    });
  }

  setSearchInputRef(node) {
    this.searchInputRef = node;
  }

  getSearch() {
    return this.state.search;
  }

  hasSearch() {
    return this.state.search !== null;
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
