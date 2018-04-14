import Store from 'electron-store';

class PreferencesStore extends Store {
  getDefaultTerminal() {
    switch (process.platform) {
      default:
      case 'darwin':
        return 'open -a "Terminal" %s';
      case 'linux':
        return 'gnome-terminal --working-directory="%s"';
      case 'win32':
        return 'start cmd.exe /K "cd /d %s"';
    }
  }

  getDefaultEditor() {
    return null;
  }

  ensureDefaults() {
    this.set('terminal', this.get('terminal', this.getDefaultTerminal()));
    this.set('editor', this.get('editor', this.getDefaultEditor()));
    this.set('pinned', this.get('pinned', []));
    this.set('projects', this.get('projects', []));
    return this;
  }
}

function createStore() {
  return new PreferencesStore();
}

export default createStore;
