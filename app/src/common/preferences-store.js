import Store from 'electron-store';
import electron from 'electron';

const isMain = process && process.type !== 'renderer';
const isTest = global.process.env.NODE_ENV === 'test';

// Use temp directory during tests
// Note that `global.` is requried to prevent webpack from replacing it on build step
if (isMain && isTest) {
  electron.app.setPath('userData', electron.app.getPath('temp'));
}

const store = new Store();

// Set defaults once in main process
if (isMain) {
  store.set('pinned', store.get('pinned', []));
  store.set('projects', store.get('projects', []));
  store.set('terminal', store.get('terminal', 'Terminal'));
}

export default store;
