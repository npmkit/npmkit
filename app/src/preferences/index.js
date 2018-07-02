import createStore from './create-store';

const preferences = createStore().ensureDefaults();

export default preferences;
