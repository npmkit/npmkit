import Store from 'electron-store';

const store = new Store();

// Set defaults
store.set('pinned', store.get('pinned', []));
store.set('projects', store.get('projects', []));
store.set('terminal', store.get('terminal', 'Terminal'));

export default store;
