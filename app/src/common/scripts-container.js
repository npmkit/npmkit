import { Container } from 'unstated';
import { ipcRenderer } from 'electron';
import flatten from 'lodash.flatten';
import Channels from '~/common/channels';

/**
 * This state container keeps all info about background script processes
 */
export default class ScriptsContainer extends Container {
  state = {};

  constructor(...args) {
    super(...args);
    // Subscribe to background scripts status from main process
    ipcRenderer.on(Channels.SCRIPT_STARTED, (_, { project, script, pid }) =>
      this.markAsRunning(project, script, pid)
    );
    ipcRenderer.on(Channels.SCRIPT_EXITED, (_, { project, script }) =>
      this.markAsExited(project, script)
    );
    // Stop all background scripts on exit
    // todo: do it on main process side?
    window.addEventListener('beforeunload', () => {
      this.stopAll();
    });
  }

  /** Run script */
  run(project, script) {
    ipcRenderer.send(Channels.SCRIPT_RUN, { project, script });
  }

  /** Stop script */
  stop(project, script) {
    ipcRenderer.send(
      Channels.SCRIPT_STOP,
      this.getRunning(project).find(current => current.name === script)
    );
  }

  /** Stops all scripts */
  stopAll() {
    flatten(
      Object.keys(this.state).map(project => this.state[project])
    ).forEach(script => {
      ipcRenderer.send(Channels.SCRIPT_STOP, script);
    });
  }

  /** Mark process as active in state */
  markAsRunning(project, script, pid) {
    const prev = this.state[project.code] || [];
    this.setState({ [project.code]: [...prev, { name: script, pid }] });
  }

  /** Mark process as exited in state */
  markAsExited(project, script) {
    const prev = this.state[project.code] || [];
    this.setState({
      [project.code]: prev.filter(current => current.name !== script),
    });
  }

  /** Returns an array of processes if any */
  getRunning(project) {
    return this.state[project.code] || [];
  }

  /** Check if requested project is running */
  isRunning(project, script) {
    return Boolean(
      this.getRunning(project).find(current => current.name === script)
    );
  }
}
