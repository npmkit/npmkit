import Store from 'electron-store';

function createStore(setDefaults = false) {
  const store = new Store();
  if (setDefaults) {
    store.set('pinned', store.get('pinned', []));
    store.set('projects', store.get('projects', []));
    store.set('terminal', store.get('terminal', 'Terminal'));
  }
  return store;
}

export default createStore;
